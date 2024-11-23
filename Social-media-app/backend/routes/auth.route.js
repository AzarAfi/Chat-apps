import express from "express"
import { signup,login, logout ,getme} from "../controller/auth.contrller.js";
import protuctRoute from "../middleware/productRoute.js"
const router =express.Router();



router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.get("/me",protuctRoute, getme)


export default router;