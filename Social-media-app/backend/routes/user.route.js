import express from "express"
import productRoute from "../middleware/productRoute.js";
import { getprofile,follow_and_unfollow } from "../controller/user.contrller.js";
const router = express.Router()


router.get("/profile/:username",productRoute,getprofile)
router.post("/follow/:id",productRoute,follow_and_unfollow)








export default router;