import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import {Comment} from "../models/comment.model.js"
import cloudinary from "cloudinary";
import { getReceiverSocketId } from "../socket/socket.js";

//adding new post
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(401).json({
        message: "image required --post model.js",
      });
    }

    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // convering the image to url
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id), await user.save();
    }

    await post.populate({ path: "author", select: "-passWord" });

    return res.status(201).json({
      message: "new post created --post controller",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all the posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "userName profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//getting all the posts of the user
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "userName  profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "userName, profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//like the post
export const likes = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    //like logic
    await post.updateOne({ $addToSet: { likes: likeKarneWaleUserKiId } });
    await post.save();

    //implementing socket.io for real time notification
    const user = await User.findById(likeKarneWaleUserKiId).select("profilePicture userName");
    const postOwnerId =  post.author.toString();
    if(postOwnerId != likeKarneWaleUserKiId){
      //emit a notification event of like 
      const notification={
        type:"like",
        userId:likeKarneWaleUserKiId,
        userDetails:User,
        postId,
        message:"your post was liked"
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification",notification)
    } 

    return res.status(200).json({
      message: "post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//dislike the posts
export const disLikes = async (req, res) => {
  try {
    const disLikeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    //like logic
    await post.updateOne({ $pull: { likes: disLikeKarneWaleUserKiId } });
    await post.save();

    //implementing socket.io for real time notification
    const user = await User.findById(likeKarneWaleUserKiId).select("profilePicture userName");
    const postOwnerId =  post.author.toString();
    if(postOwnerId != disLikeKarneWaleUserKiId){
      //emit a notification event of like 
      const notification={
        type:"dislike",
        userId:disLikeKarneWaleUserKiId,
        userDetails:User,
        postId,
        message:"your post was liked"
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification",notification)
    } 

    return res.status(200).json({
      message: "post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//add comment
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKarneWalaUserKiId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId); // getting post id

    if (!text) {
      return res.status(400).json({
        message: "something went wrong -- post controller",
        success: false,
      });
    }

    const comment = await Comment
      .create({
        text,
        author: commentKarneWalaUserKiId,
        post: postId,
      });
      
      await comment.populate({
        path: "author",
        select: "userName profilePicture",
      });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "comment added  --post controller",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//post wise get comments of posts
export const getCommentsOfPosts = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment
      .find({ post: postId })
      .populate("author", "userName", "profilePicture");
    if (!comments) {
      return res.status(404).json({
        message: "no comments found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

//deleting the post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found --post controller deleting",
        success: false,
      });
    }

    // check is the logged in user is the owner of the post
    if (post.author.toString() != authorId)
      return res.status(200).json({
        message: "Post deleted successfully",
        success: true,
      });

    //delete post
    await Post.findByIdAndDelete(postId);

    //removing the post id from the user post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() != postId);
    await user.save();

    //delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "post deleted --post controller",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//book mark of the post
export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(200).json({
        message: "post not found --post controller bookmark",
        success: false,
      });
    }
    const user = await User.findById(authorId);
    if(user.bookMarks.includes(post._id)){
      // already bookmark ---> remove from book mark
      await User.updateOne({$pull:{bookMarks:post._id}});
      await user.save()
      return res.status(200).json({
        type:"saved",
        message: "post removed from bookmarked --post controller bookmark",
        success: true,
      });
    }
    else{
      // bookmark krna padega
      await User.updateOne({$addToSet:{bookMarks:post._id}});
      await user.save()
      return res.status(200).json({
        type:"unsaved",
        message: "post bookmarked --post controller bookmark",
        success: true,
      });
    }


  } catch (error) {
    console.log(error);
  }
};
