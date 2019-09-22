import { ApolloError, AuthenticationError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";
import cloudinary from "cloudinary";
import path from "path";

import Blog from "../../models/blog";
import User from "../../models/users";
import { isAuthenticated } from "../../services/authorization";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default {
  createBlog: combineResolvers(isAuthenticated, async (_, args) => {
    // Create Blog
    const blog = new Blog({
      title: args.title,
      body: args.body,
      fileName: args.fileName
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
  }),
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
  updateBlog: combineResolvers(isAuthenticated, async args => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(args.blogId, args, {
        new: true
      });

      if (!updatedBlog) {
        throw new ApolloError("Blog was Not Found");
      }

      return updatedBlog;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }),
  deleteBlog: combineResolvers(isAuthenticated, async args => {
    try {
      const deletedBlog = await Blog.findByIdAndRemove(args.blogId);

      if (!deletedBlog) {
        throw new ApolloError("Blog was Not Found");
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
  })
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
