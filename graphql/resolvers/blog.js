import cloudinary from "cloudinary";
import path from "path";
// import multer from "multer";

import Blog from "../../models/blog";
import User from "../../models/users";

// const upload = multer({ dest: "uploads/" });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default {
  createBlog: async (_, args, req) => {
    // Create Blog
    const blog = new Blog({
      title: args.blogInput.title,
      body: args.blogInput.body,
      fileName: args.blogInput.fileName
    });

    // Save Blog to DB
    try {
      const savedBlog = await blog.save();

      // Find the user who created the post and delete post from his createdPost collection
      const singleUser = await User.findByIdAndUpdate(
        Id,
        { $push: { createdBlogs: savedBlog } },
        { new: true }
      );

      // check if the user exist
      if (!singleUser) {
        throw new ApolloError("User Not Found");
      }
      await singleUser.save();

      // Response
      return savedBlog;
    } catch (err) {
      throw err;
    }
  },
  viewBlogs: async () => {
    try {
      const blogs = await Blog.find();

      // Response
      return blogs;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateBlog: async args => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(args.blogId, args, {
        new: true
      });

      if (!updatedBlog) {
        throw new Error("Blog was Not Found");
      }

      return updatedBlog;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  deleteBlog: async args => {
    try {
      const deletedBlog = await Blog.findByIdAndRemove(args.blogId);

      if (!deletedBlog) {
        throw new Error("Blog was Not Found");
      }

      // Find the user who created the post and delete post from his createdPost collection
      const aUser = await User.findByIdAndUpdate(
        Id,
        { $pull: { createdBlogs: deletedBlog } },
        { new: true }
      );

      // check if the user exist
      if (!aUser) {
        throw new ApolloError("User Not Found");
      }
      await aUser.save();

      return {
        deletedBlog,
        message: "Blog Was Deleted Successfully",
        value: true
      };
    } catch (err) {
      throw err;
    }
  }
  // uploadImage: async ({ fileName }) => {
  //   // const mainDir = path.dirname(require.main.filename);
  //   // fileName = `${mainDir}/uploads/${fileName}`;
  //   try {
  //     const image = await cloudinary.v2.uploader.upload(fileName);

  //     console.log(image);
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }
};
