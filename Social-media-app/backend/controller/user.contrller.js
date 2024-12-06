        import User from "../models/user.model.js"
        import Notification from "../models/notification.model.js";
        import bcrypt from "bcryptjs"
        import cloudinary from "cloudinary"

        export const getprofile = async (req, res)=>{

                try {
                    const {username} = req.params;

                    const user = await User.findOne({username})

                    if(!user){
                    return res.status(400).json({error:"user not found"})
                    }

                    res.status(200).json(user)

                    
                } catch (error) {

                    console.log(`error in getprofile${error}`)
                    res.status(500).json({error:"Internal server error"})
                    
                }
        }

          /* follow and un follow page */


          export const follow_and_unfollow = async (req, res) => {
            try {
                const { id } = req.params;
                const userToModify = await User.findById(id);
                const currentUser = await User.findById(req.user._id);
        
                if (id === req.user._id) {
                    return res.status(400).json({ error: "You can't follow/unfollow yourself" });
                }
        
                if (!userToModify || !currentUser) {
                    return res.status(400).json({ error: "User not found" });
                }
        
                const isFollowing = currentUser.following.includes(id);
        
                if (isFollowing) {
                    // Unfollow
                    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
                    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

                    return res.status(200).json({ message: "Unfollowed successfully" })
                   
                } else {
                    // Follow
                    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
                    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
                    //send notification
                    const newNotification = new Notification ({
                        type: "follow",
                        from:req.user._id,
                        to:userToModify._id
                    })
                    await newNotification.save()

                    
                    return res.status(200).json({ message: "Followed successfully" });
                }
        
            } catch (error) {
                console.error(`Error in follow_and_unfollow: ${error.message}`);
                res.status(500).json({ error: "Internal server error" });
            }
        };

               /*  Suggested unfollow profile*/

               export const getSuggestedUser = async (req, res) => {
                try {
                    const userId = req.user._id;
            
                    // Get the current user data (excluding password)
                    const userFollowedbyMe = await User.findById({ _id: userId }).select("-password");
            
                    // Find 10 random users who are not the current user and not followed by the current user
                    const users = await User.aggregate([
                        {
                            $match: {
                                _id: { $ne: userId }, // Exclude the current user
                                _id: { $nin: userFollowedbyMe.following } // Exclude users already followed by the current user
                            }
                        },
                        {
                            $sample: { size: 10 } // Randomly select 10 users
                        }
                    ]);
            
                    // Remove the password field from the suggested users
                    users.forEach((user) => (user.password = null));
            
                    // Limit the number of suggested users to 4
                    const suggestedUsers = users.slice(0, 4);
            
                    // Return the list of suggested users
                    res.status(200).json(suggestedUsers);
                } catch (error) {
                    console.error(`Error in getSuggestedUser: ${error.message}`);
                    res.status(500).json({ error: "Internal server error" });
                }
            };

            /* Upadte user page */

            export const updateUser = async (req, res) => {
                try {
                    const userId = req.user._id;
                    const { username, fullname, email, currentpassword, newpassword, bio, link } = req.body;
                    let { profileImg, coverImg } = req.body;
            
                    // Find the user in the database
                    let user = await User.findById({ _id: userId });
                    if (!user) {
                        return res.status(400).json({ error: "User not found" });
                    }
            
                    // Validate current and new password fields
                    if ((!newpassword && currentpassword) || (newpassword && !currentpassword)) {
                        return res.status(400).json({ error: "Please enter both current password and new password" });
                    }
            
                    if (currentpassword && newpassword) {
                        const isMatch = await bcrypt.compare(currentpassword, user.password);
                        if (!isMatch) {
                            return res.status(400).json({ error: "Current password is incorrect" });
                        }
            
                        if (newpassword.length < 6) {
                            return res.status(400).json({ error: "New password must have at least six characters" });
                        }
            
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(newpassword, salt);
                    }
            
                    // Handle profile and cover images (Cloudinary upload logic)
                     /* Uncomment if image upload is needed */
                    if (profileImg) {
                        if (user.profileImg) {
                            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
                        }
                        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
                        profileImg = uploadedResponse.secure_url;
                    }
            
                    if (coverImg) {
                        if (user.coverImg) {
                            await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
                        }
                        const uploadedResponse = await cloudinary.uploader.upload(coverImg);
                        coverImg = uploadedResponse.secure_url;
                    }
                    
            
                    // Update user fields if new values are provided
                    user.fullname = fullname || user.fullname;
                    user.username = username || user.username;
                    user.email = email || user.email;
                    user.bio = bio || user.bio;
                    user.link = link || user.link;
                    user.profileImg = profileImg || user.profileImg;
                    user.coverImg = coverImg || user.coverImg;  // Updated logic for coverImg
            
                    // Save the updated user document
                    user = await user.save();
            
                    // Remove password from the response before sending it back to the client
                    user.password = null;
            
                    return res.status(200).json(user);
            
                } catch (error) {
                    console.error(`Error in updateUser: ${error.message}`);
                    res.status(500).json({ error: "Internal server error" });
                }
            };
            