import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
