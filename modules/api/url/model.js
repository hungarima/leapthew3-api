const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const commentModel = new Schema(
//   {
//     createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
//     content: { type: String, required: true }
//   },
//   { timestamps: { createdAt: "createdAt" } }
// );

const urlModel = new Schema(
  {
    url: { type: String, required: true },
    contentType: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    leapCount: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("url", urlModel);
