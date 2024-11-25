import express from "express"
import productRoute from "../middleware/productRoute.js";
import { getprofile,follow_and_unfollow, getSuggestedUser,updateUser} from "../controller/user.contrller.js";
const router = express.Router()


router.get("/profile/:username",productRoute,getprofile)
router.post("/follow/:id",productRoute,follow_and_unfollow)
router.get("/suggested", productRoute,getSuggestedUser)
router.post("/updateuser", productRoute,updateUser)







export default router;