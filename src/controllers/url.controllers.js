const validUrl = require("valid-url");
const Url = require("../models/Url");
const User = require("../models/User");

const urlCtrl = {};

urlCtrl.getUrl = async (req, res) => {
  const id = req.params.id;

  try {
    const url = await Url.findById(id);

    if (validUrl.isUri(url.longUrl)) {
      return res.json(url);
    } else {
      res.status(400).json({ message: "Invalid URL" });
    }
  } catch (error) {
    res.status(404).json({ message: "Url not found" });
  }
};

urlCtrl.postUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  try {
    const url = await Url.findOne({ longUrl });
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("urls");

    if (url) {
      if (user.urls.some((e) => e.id === url._id)) {
        return res.status(400).json({
          ok: false,
          msg: "Url already saved",
        });
      } else {
        user.urls.push(url._id);
        await user.save();
        return res.json({ ok: true, url });
      }
    }

    const newUrl = new Url({
      longUrl,
    });

    await newUrl.save();

    user.urls.push(newUrl._id);
    await user.save();

    res.json({ ok: true, url: newUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = urlCtrl;
