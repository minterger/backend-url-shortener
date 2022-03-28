const validUrl = require("valid-url");
const Url = require("../models/Url");
const User = require("../models/User");

const urlCtrl = {};

urlCtrl.getUrl = async (req, res) => {
  const id = req.params.id;

  try {
    const url = await Url.findById(id).populate(
      "ownerUsers",
      "-password -urls"
    );

    if (!url) {
      return res.status(400).json({
        ok: false,
        msg: "Url not found",
      });
    }

    return res.json(url);
  } catch (error) {
    res.status(404).json({
      ok: false,
      msg: "Url not found",
    });
  }
};

urlCtrl.goUrl = async (req, res) => {
  const id = req.params.id;

  try {
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({
        ok: false,
        msg: "Url not found",
      });
    }

    url.clicks++;
    if (url.clicks > 500) {
      await url.remove();
      return res.status(404).json({
        ok: false,
        msg: "Url not found",
      });
    } else {
      await url.save();
      return res.json({ url: url.longUrl });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      msg: "Url not found",
    });
  }
};

urlCtrl.postUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({
      ok: false,
      msg: "Invalid URL",
    });
  }

  try {
    const url = await Url.findOne({ longUrl }).populate(
      "ownerUsers",
      "-password -urls"
    );
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("urls");

    if (url) {
      if (
        user.urls.some((e) => e._id === url._id) ||
        url.ownerUsers.some((e) => user._id.equals(e._id))
      ) {
        return res.status(400).json({
          ok: false,
          msg: "Url already saved",
          id: url._id,
        });
      } else {
        user.urls.push(url._id);
        await user.save();
        url.ownerUsers.push(user._id);
        await url.save();
        return res.json({ ok: true, url });
      }
    }

    const newUrl = new Url({
      longUrl,
    });

    newUrl.ownerUsers.push(user._id);

    await newUrl.save();

    user.urls.push(newUrl._id);
    await user.save();

    res.json({ ok: true, url: newUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

urlCtrl.deleteUrl = async (req, res) => {
  const id = req.params.id;

  try {
    const url = await Url.findById(id).populate(
      "ownerUsers",
      "-password -urls"
    );

    if (!url) {
      return res.status(404).json({
        ok: false,
        msg: "Url not found",
      });
    }

    const user = await User.findById(req.userId)
      .select("-password")
      .populate("urls");

    if (
      !user.urls.some((e) => e._id === url._id) &&
      !url.ownerUsers.some((e) => e._id.equals(user._id))
    ) {
      return res.status(400).json({
        ok: false,
        msg: "Url not found",
      });
    }

    user.urls = user.urls.filter((e) => e._id !== url._id);

    url.ownerUsers = url.ownerUsers.filter((e) => !e._id.equals(user._id));

    if (url.ownerUsers.length === 0) {
      await url.remove();
    } else {
      await url.save();
    }

    await user.save();

    res.json({ ok: true, msg: "Url deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = urlCtrl;
