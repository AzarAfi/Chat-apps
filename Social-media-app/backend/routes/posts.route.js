import express from "express"
import productRoute from "../middleware/productRoute.js";
import { createPost ,deletePost,createComment} from "../controller/post.controller.js";

const router = express.Router();


router.post("/create",productRoute,createPost)
// router.post("/like/:id",productRoute,createlike)
router.post("/comment/:id",productRoute,createComment)
router.delete("/:id",productRoute, deletePost) 



export default router;