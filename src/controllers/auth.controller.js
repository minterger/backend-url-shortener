const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authCtrl = {};

authCtrl.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    const validEmail = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

    if (!validEmail) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid email",
      });
    }
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Passwords do not match",
      });
    }

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({
      ok: true,
      msg: "User created",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

authCtrl.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User not found",
      });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({
      ok: true,
      msg: "User logged in",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

authCtrl.getUser = async (req, res) => {
  const id = req.userId;

  try {
    const user = await User.findById(id).select("-password").populate("urls");

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User not found",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authCtrl;
