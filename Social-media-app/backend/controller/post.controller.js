import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"

export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};

            /* delete post  */

            export const deletePost = async (req, res) => {
                try {
                    const post = await Post.findById(req.params.id);
                    if (!post) {
                        return res.status(404).json({ error: "Post not found" });
                    }
            
                    if (post.user.toString() !== req.user._id.toString()) {
                        return res.status(401).json({ error: "You are not authorized to delete this post" });
                    }
            
                    if (post.img) {
                        const imgId = post.img.split("/").pop().split(".")[0];
                        await cloudinary.uploader.destroy(imgId);
                    }
            
                    await Post.findByIdAndDelete(req.params.id);
            
                    res.status(200).json({ message: "Post deleted successfully" });
                } catch (error) {
                    console.log("Error in deletePost controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            };
        
            
            /* create comment post */


            export const commentOnPost = async (req, res) => {
                try {
                    const { text } = req.body;
                    const postId = req.params.id;
                    const userId = req.user._id;
            
                    if (!text) {
                        return res.status(400).json({ error: "Text field is required" });
                    }
                    const post = await Post.findById(postId);
            
                    if (!post) {
                        return res.status(404).json({ error: "Post not found" });
                    }
            
                    const comments = { user: userId, text };
            
                    post.comments.push(comments);
                    await post.save(); 
            
                    res.status(200).json(post);
                } catch (error) {
                    console.log("Error in commentOnPost controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            };


            // Like the post

            export const createLike = async (req, res) => {
                try {
                    const userId = req.user._id; // The user performing the like/unlike
                    const { id } = req.params; // The post ID from the request params
            
                    // Find the post by ID
                    const post = await Post.findOne({ _id: id });
                    if (!post) {
                        return res.status(404).json({ error: "Post not found" });
                    }
            
                    // Check if the user has already liked the post
                    const userLikePost = post.likes.includes(userId);
                    if (userLikePost) {
                        // If the user has already liked, unlike the post
                        await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
                        await User.updateOne({_id:userId},{ $pull: { likedPost: id } })
                        const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
                        
                        res.status(200).json(updatedLikes);
                    } else {
                        // If the user has not liked the post, like it
                        post.likes.push(userId);
                        await User.updateOne({_id:userId},{$push:{likedPost:id}})

                        await post.save();
            
                        // Create a notification for the post owner
                        const notification = new Notification({
                            from: userId, // The user who liked the post
                            to: post.user, // The post owner
                            type: "like"
                        });
                        await notification.save();
                        const updatedLikes = post.likes;
                        res.status(200).json(updatedLikes);
                    }
                } catch (error) {
                    console.log("Error in Like post controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            };

            
            // get all post page 
            
            export const getAllPost = async (req,res) =>{
                try {
                    const posts = await Post.find().sort({createdAt:-1}).populate({
                        path:"user",
                        select:"-password"
                    }).populate({
                        path:"comments.user",
                         select:["-password","-email","-following","-followers","-link","-bio"]
                    })
                    if(posts.length === 0){
                        return res.status(200).json([])
                    }    
                    res.status(200).json(posts)               
                } catch (error) {
                    console.log("Error in get all post controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                    
                }
            }

            // getLike posts

            export const getLikedPost = async (req, res) => {
                try {
                    const userId = req.params.id;  // The user whose liked posts we are retrieving
            
                    // Find the user by ID
                    const user = await User.findOne({ _id: userId });
                    if (!user) {
                        return res.status(404).json({ error: "User not found" });
                    }
            
                    // Find the posts liked by the user (assuming likedPost is an array of post IDs)
                    const likedPost = await Post.find({ _id: { $in: user.likedPost } })
                        .populate({
                            path: "user",
                            select: "-password"  // Don't include the password of the user who posted
                        })
                        .populate({
                            path: "comments.user",  // Populate the user for each comment
                            select: ["-password", "-email", "-following", "-followers", "-link", "-bio"]
                        });
            
                    // Check if there are liked posts, otherwise return an empty array
                    if (!likedPost.length) {
                        return res.status(200).json({ message: "No liked posts found" });
                    }
            
                    // Send the liked posts as the response
                    res.status(200).json({ likedPost });
                } catch (error) {
                    console.log("Error in get all liked posts controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            };
            

            // get Following Post page
             
            export const getFollowingPost = async (req,res) =>{
                try {

                    const userId = req.user._id;
                    const user= await User.findById({_id:userId})

                    if (!user) {
                        return res.status(404).json({ error: "User not found" });
                    }

                    const following = user.following;
                    const feedPost= await Post.find({user:{$in:following}}).sort({createdAt:-1}).populate({
                        path:"user",
                        select:"-password"
                    }).populate({
                        path:"comments.user",
                         select:["-password","-email","-following","-followers","-link","-bio"]
                    })

                    res.status(200).json({ feedPost});
                    
                } catch (error) {
                    console.log("Error in following posts controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            }


            // get user post

            export const getUserPost = async (req, res) => {
                try {
                    const { username } = req.params;  // Get username from URL params
            
                    // Find the user by username (assuming 'username' is unique)
                    const user = await User.findOne({ username: username });
                    if (!user) {
                        return res.status(404).json({ error: "User not found" });
                    }
            
                    // Fetch posts by this user, sorted by creation date, and populate user and comments
                    const posts = await Post.find({ user: user._id })
                        .sort({ createdAt: -1 })
                        .populate({
                            path: "user",
                            select: "-password"  // Exclude the password from user details
                        })
                        .populate({
                            path: "comments.user",  // Populate user details for comments
                            select: ["-password", "-email", "-following", "-followers", "-link", "-bio"]
                        });
            
                    // If the user has no posts, return an empty array
                    if (!posts.length) {
                        return res.status(200).json({ posts: [] });
                    }
            
                    // Return the posts for the user
                    res.status(200).json({ posts });
            
                } catch (error) {
                    console.log("Error in get user posts controller: ", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            };
            