import express from "express"
import productRoute from "../middleware/productRoute.js";
import { getNotification,deleteNotification} from "../controller/notification.controll.js";

const router =express.Router();


router.get("/getnotification",productRoute,getNotification)
router.delete("/deletenotification",productRoute,deleteNotification)

export default router;