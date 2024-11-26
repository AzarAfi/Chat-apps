import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postsRoute from "./routes/posts.route.js"
import connectDB from "./db/connecDB.js";
import cookieParser from "cookie-parser"
import cloudinary from "cloudinary"

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    Api_key:process.env.CLOUDINARY_API_KEY,
    Api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})
const app = express();
const PORT= process.env.PORT;
  
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postsRoute)

app.listen(PORT,()=>{

    console.log(`server run ${PORT}`)
    connectDB();
})