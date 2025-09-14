import express from "express";
import { getPosts, createPost, likePost, addComment } from "../controllers/communityController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getPosts);
router.post("/", verifyToken, createPost);
router.post("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, addComment);

export default router;
