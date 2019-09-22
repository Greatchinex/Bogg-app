import { GraphQLDateTime } from "graphql-iso-date";
import { GraphQLUpload } from "graphql-upload";

import userResolver from "./user";
import blogResolver from "./blog";

import Blog from "../../models/blog";
import User from "../../models/users";

export default {
  Date: GraphQLDateTime,
  Upload: GraphQLUpload,
  Blog: {
    createdBy: (_, args, { logged_in_user, Id }) => User.findOne({ _id: Id })
  },
  UserProfile: {
    createdBlogs: (_, args, { logged_in_user, Id }) => Blog.find()
  },
  RootQuery: {
    login: userResolver.login,
    userProfile: userResolver.userProfile,
    viewBlogs: blogResolver.viewBlogs
  },
  RootMutation: {
    createUser: userResolver.createUser,
    createBlog: blogResolver.createBlog,
    updateBlog: blogResolver.updateBlog,
    deleteBlog: blogResolver.deleteBlog
    // uploadImage: blogResolver.uploadImage
  }
};
