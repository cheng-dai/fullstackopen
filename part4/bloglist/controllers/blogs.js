import express from "express";
import "express-async-errors";
import Blog from "../models/blog.js";
import User from "../models/user.js";

const blogsRouter = express.Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!("url" in request.body) || !("title" in request.body)) {
    return response.status(400).end();
  }
  const user = await User.findOne({});
  const blog = new Blog({ ...request.body, user });
  blog.likes = blog.likes || 0;
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

// delete a blog
blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
    if (!deletedBlog) {
      return response.status(404).end();
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

export { blogsRouter };
