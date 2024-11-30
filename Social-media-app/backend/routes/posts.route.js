import express from "express"
import productRoute from "../middleware/productRoute.js";
import { createPost ,deletePost,commentOnPost,createLike,getAllPost,getLikedPost,getFollowingPost,getUserPost} from "../controller/post.controller.js";

const router = express.Router();

router.get("/all",productRoute,getAllPost)
router.get("/following",productRoute,getFollowingPost)
router.get("/user/:username",productRoute,getUserPost)
router.get("/userlikes/:id",productRoute,getLikedPost)
router.post("/create",productRoute,createPost)
router.post("/like/:id",productRoute,createLike)
router.post("/comment/:id",productRoute,commentOnPost)
router.delete("/:id",productRoute, deletePost) 



export default router;