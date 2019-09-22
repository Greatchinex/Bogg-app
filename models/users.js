import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  createdBlogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
});

export default mongoose.model("User", userSchema);
