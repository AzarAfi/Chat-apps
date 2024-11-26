import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required:true, 
    },

    img: {
      type: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comment: [
      {
        text: {
          type: String,
          required: true, // Ensures comment text is required
          minlength: 1,  // Minimum length for a comment (optional)
          maxlength: 500, // Limit the comment length (optional)
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt'
);

const Post = mongoose.model("Post", postSchema); // "Post" is the model name (singular)
export default Post;
