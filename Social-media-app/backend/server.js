//import packages

import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cloudinary from "cloudinary"

// import routes
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postsRoute from "./routes/posts.route.js"
import notificationRoute from "./routes/notification.route.js"
// import databace connection
import connectDB from "./db/connecDB.js";
//connect port frontend
import cors from "cors"

// confic files
  //dotenv
 dotenv.config();
 //cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    Api_key:process.env.CLOUDINARY_API_KEY,
    Api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})

// insulation variables
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with the frontend URL
    credentials: true, // Allow cookies to be sent
  };
  app.use(cors(corsOptions));
  


const PORT= process.env.PORT; 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended:true
}))

// routes path

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postsRoute)
app.use("/api/notification",notificationRoute)


// make local server

app.listen(PORT,()=>{

    console.log(`server run ${PORT}`)
    connectDB();
})