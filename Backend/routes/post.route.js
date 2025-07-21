import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookMarkPost, deletePost, disLikes, getAllPosts, getCommentsOfPosts, getUserPost, likes } from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated,upload.single("image"),addNewPost);
router.route("/all").get(isAuthenticated,getAllPosts);
router.route("/userpost/all").get(isAuthenticated,getUserPost);
router.route("/:id/like").get(isAuthenticated,likes);
router.route("/:id/dislikes").get(isAuthenticated,disLikes);
router.route("/:id/comment").post(isAuthenticated,addComment);
router.route("/:id/comment/all").post(isAuthenticated,getCommentsOfPosts);
router.route("/delete/:id").delete(isAuthenticated,deletePost);
router.route("/:id/bookmark").post(isAuthenticated,bookMarkPost);

export default router;