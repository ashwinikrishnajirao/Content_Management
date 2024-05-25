import express from "express";
import { getLikes, addLike, deleteLike, getLikedStatus } from "../controllers/like.js";

const router = express.Router()

router.get("/count", getLikes)
router.post("/", addLike)
router.delete("/", deleteLike)
router.get("/:id",getLikedStatus)

export default router