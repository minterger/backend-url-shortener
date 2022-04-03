const { model, Schema, Types } = require("mongoose");
const shortid = require("shortid");

const urlSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    longUrl: {
      type: String,
      required: true,
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

// urlSchema.pre("save", function (next) {
//   this.shortUrl = process.env.BASE_URL + "/" + this._id;
//   next();
// });

module.exports = model("Url", urlSchema);
