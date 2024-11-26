import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" }); 
        }

        
        if (!img && !text) {
            return res.status(400).json({ error: "Either image or text must be provided" }); // Clarified message
        }



        if (img)
            {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url; // Get the URL of the uploaded image
            } catch (error) {
                return res.status(500).json({ error: "Image upload failed" }); // Handle Cloudinary errors specifically
            }
        }

        // Create the new post
        const newPost = new Post({

                            user: userId,
                            text,
                            img,
        });

        // Save the post to the database
        await newPost.save();

        // Respond with the newly created post
        return res.status(201).json(newPost);

    } catch (error) {
        console.error(`The create post error: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

            /* delete post  */

        export const deletePost = async (req, res) => {
                try {
                    const { id } = req.params;
            
                    // Find the post by its ID
                    const post = await Post.findById(id);
            
                    if (!post) {
                        return res.status(404).json({ error: "Post not found" }); // Corrected to Post not found
                    }
            
                    // Check if the current user is authorized to delete the post
                    if (post.user.toString() !== req.user._id.toString()) {
                        return res.status(403).json({ error: "You are not authorized to delete this post" }); // 403 for forbidden action
                    }
            
                    // Delete image from Cloudinary if it exists
                    if (post.img) {
                        const imgId = post.img.split("/").pop().split(".")[0];
                        await cloudinary.uploader.destroy(imgId); // Destroy the image from Cloudinary
                    }
            
                    // Delete the post from the database
                    await post.deleteOne({ _id: id });
            
                    // Respond with a success message
                    return res.status(200).json({ message: "Post deleted successfully" }); // Corrected to 200 OK
            
                } catch (error) {
                    console.error(`The delete post error: ${error}`);
                    return res.status(500).json({ error: "Internal server error" });
                }
            };
        
            
            /* create comment post */

            export const createComment = async (req, res) => {
                try {
                    const { text } = req.body;
                    const postId = req.params.id;
                    const userId = req.user._id;
            
                    // Validate text field
                    if (!text) {
                        return res.status(400).json({ error: "Please enter your comment" });
                    }
            
                    // Check if the post exists
                    const post = await Post.findOne({ _id: postId }).select('comments');
                    if (!post) {
                        return res.status(404).json({ error: "Post not found" });
                    }
            
                    // Create the new comment object
                    const userComment = {
                        user: userId,
                        text
                    };
            
                    // Push the new comment to the post's comments array
                    post.comments.push(userComment);
                    await post.save();
            
                    // Respond with the new comment
                    res.status(200).json({ message: "Comment added successfully", comment: userComment });
            
                } catch (error) {
                    console.error(`Error in createComment: ${error}`);
                    return res.status(500).json({ error: "Internal server error" });
                }
            };
            