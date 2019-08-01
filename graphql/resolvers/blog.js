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
  createBlog: async (args, req) => {
    // Create Blog
    const blog = new Blog({
      title: args.blogInput.title,
      body: args.blogInput.body,
      fileName: args.blogInput.fileName
    });
    console.log(req.file);

    // Save Blog to DB
    try {
      const savedBlog = await blog.save();
      return {
        ...savedBlog._doc,
        createdAt: new Date(savedBlog._doc.createdAt).toISOString(),
        updatedAt: new Date(savedBlog._doc.updatedAt).toISOString()
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  viewBlog: async args => {
    try {
      const blogs = await Blog.find();
      return blogs;
      // return blogs.map(blog => {
      //   return {
      //     ...blog._doc
      //   };
      // });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateBlog: async args => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(args.blogId, args);

      if (!updatedBlog) {
        throw new Error("Blog was Not Found");
      }

      return {
        ...updatedBlog._doc,
        updatedAt: new Date(updatedBlog._doc.updatedAt).toISOString(),
        createdAt: new Date(updatedBlog._doc.createdAt).toISOString()
      };
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

      return {
        ...deletedBlog._doc,
        message: "Blog Was Deleted Successfully",
        value: true
      };
    } catch (err) {
      throw err;
    }
  },
  uploadImage: async ({ fileName }) => {
    // const mainDir = path.dirname(require.main.filename);
    // fileName = `${mainDir}/uploads/${fileName}`;
    try {
      const image = await cloudinary.v2.uploader.upload(fileName);

      console.log(image);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
