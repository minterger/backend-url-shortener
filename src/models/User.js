const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  urls: [
    {
      type: String,
      ref: "Url",
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
    console.log(user.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

module.exports = model("User", userSchema);
