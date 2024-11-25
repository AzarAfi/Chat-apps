        import User from "../models/user.model.js"
        import Notification from "../models/notification.model.js";

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
        