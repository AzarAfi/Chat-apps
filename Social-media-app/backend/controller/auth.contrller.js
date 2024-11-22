import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'; 

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
        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Return the user data (excluding password)
        res.status(200).json({
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
            bio: newUser.bio,
            link: newUser.link
        });
    } catch (error) {
        // Log error with more detailed info (for dev purposes)
        console.error(`Error in signup: ${error}`);
        
        // Respond with generic error message (avoid exposing sensitive error info)
        res.status(500).json({ error: "Internal server error" });
    }
};


export const login = async (req, res) => {
   console.log("login")
};

export const logout = (req, res) => {
console.log("logout")
};
