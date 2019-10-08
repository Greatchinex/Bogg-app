import { ApolloError, AuthenticationError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";
import cloudinary from "cloudinary";
import path from "path";

import Blog from "../../models/blog";
import User from "../../models/users";
import { isAuthenticated } from "../../services/authorization";
import { pubsub } from "../../config/pubsub";

// Subscription Variables
const NEW_BLOG = "new_blog";
const UPDATED_BLOG = "update_blog";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default {
  createBlog: combineResolvers(isAuthenticated, async (_, args, { Id }) => {
    // Create Blog
    const blog = new Blog({
      title: args.title,
      body: args.body,
      createdBy: Id
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

      // Post Subscription
      pubsub.publish(NEW_BLOG, {
        [NEW_BLOG]: savedBlog
      })

      // Response
      return savedBlog;
    } catch (err) {
      console.log(err);
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
  updateBlog: combineResolvers(isAuthenticated, async (_, args) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(args.blogId, args, {
        new: true
      });

      if (!updatedBlog) {
        throw new ApolloError("Blog was Not Found");
      }

      pubsub.publish(UPDATED_BLOG, {
        [UPDATED_BLOG]: updatedBlog
      })

      return updatedBlog;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }),
  deleteBlog: combineResolvers(isAuthenticated, async (_, args, { Id }) => {
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
  }),
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

  /*******************************************************************
   *******************************************************************
    Subscriptions come here
   *******************************************************************
  ********************************************************************/

  // Returns new post
  new_blog: {
    subscribe: () => {
      return pubsub.asyncIterator([NEW_BLOG])
    }
  },
  update_blog: {
    subscribe: () => {
      return pubsub.asyncIterator([UPDATED_BLOG])
    }
  }
};
