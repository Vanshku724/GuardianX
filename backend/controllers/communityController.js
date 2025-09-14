import { CommunityPost } from "../models/CommunityPost.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "username")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = await CommunityPost.create({
      author: req.user.id,
      content,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};
