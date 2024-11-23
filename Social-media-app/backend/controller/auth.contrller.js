import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'; 
import gentrateToken from '../../utils/gentrateToken.js';
export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;

        
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if email or username already exists
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) {
            return res.status(400).json({ error: "Email is already in use" });
        }
        if (existingUsername) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user
        const user = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        });
        if(user){
            gentrateToken(user._id,res)
            await user.save();
        }
        
        
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link
        });
    } catch (error) {
        
        console.error(`Error in signup: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};




                                                          /* Login page */


export const login = async (req, res) => {
   try{

    const { username,password } = req.body;
    const  user = await User.findOne({username});
    
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"invalid username and password"})
    }
    gentrateToken(user._id,res)

    res.status(200).json({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link
    });
   }
   catch(error){
    console.error(`Error in Login: ${error}`);
    res.status(500).json({ error: "Internal server error" });
   }
};


/* Logout page */

export const logout =async (req, res) => {
try {
res.cookie("jwt","",{maxAge:0});
res.status(200).json({message:"logout successfully"})
    
} catch (error) {
    console.error(`Error in LogOut: ${error}`);
    res.status(500).json({ error: "Internal server error" });
}
};

export const getme= async (req,res)=>{
    try {
        const  user = await User.findOne({_id: req.user._id}).select("-password")
        res.status(200).json(user)
        
        
    } catch (error) {

        console.error(`Error in LogOut: ${error}`);
        res.status(500).json({ error: "Internal server error" });
        
    }
}