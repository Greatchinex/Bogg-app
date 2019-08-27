import authResolver from "./auth";
import blogResolver from "./blog";

export default {
  RootQuery: {
    login: authResolver.login,
    userProfile: authResolver.userProfile,
    viewBlogs: blogResolver.viewBlogs
  },
  RootMutation: {
    createUser: authResolver.createUser,
    createBlog: blogResolver.createBlog,
    updateBlog: blogResolver.updateBlog,
    deleteBlog: blogResolver.deleteBlog,
    uploadImage: blogResolver.uploadImage
  }
};
