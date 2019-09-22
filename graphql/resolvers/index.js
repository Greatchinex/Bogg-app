import userResolver from "./user";
import blogResolver from "./blog";

export default {
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
