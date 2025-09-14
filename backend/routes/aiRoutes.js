import express from "express";
import { invokeLLM } from "../controllers/aiController.js";

const router = express.Router();
router.post("/", invokeLLM);
export default router;
