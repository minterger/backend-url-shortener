const { model, Schema, Types } = require("mongoose");
const shortid = require("shortid");

const idGenerator = () => {
  return shortid.generate();
};

const urlSchema = new Schema(
  {
    _id: {
      type: String,
      default: idGenerator,
    },
    longUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      unique: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    ownerUsers: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

urlSchema.pre("save", function (next) {
  this.shortUrl = process.env.BASE_URL + "/" + this._id;
  next();
});

module.exports = model("Url", urlSchema);
