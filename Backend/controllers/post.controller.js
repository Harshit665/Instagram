import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User , comment } from "../models/user.model.js";


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
    fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = User.findById(authorId);

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
      .populate({ path: "author", select: "userName, profilePicture" })
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

//getting all the posts of the user
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "userName , profilePicture",
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
    await post.updateOne({ $adToSet: { likes: likeKarneWaleUserKiId } });
    await post.save();

    //implementing socket.io for real time notification

    return res.status(200).json({
        message:"post liked",
        sucess:true
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
    await post.updateOne({$pull:{disLikes:disLikeKarneWaleUserKiId}});
    await post.save();

    //implementing socket.io for real time notification

    return res.status(200).json({
        message:"post disliked",
        sucess:true
    });

  } catch (error) {
    console.log(error);
  }
};

//add comment
export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentKarneWalaUserKiId = req.id;
        const {text} = req.body;
        const post = await Post.findById(postId)// getting post id 

         if(!text){
            res.status(400).json({
                message:"something went wrong -- post controller",
                success:false
            })
         }

         const comment = await comment.create({
            text,
            author:commentKarneWalaUserKiId,
            post:postId
         }).populate({
            path:"author",
            select:"userName , profilePicture"
         })

         post.comment.push(comment._id);
         await post.save();

         return res.status(201).json({
            message:"comment added  --post controller",
            comment,
            success:true
         })

    } catch (error) {
        console.log(error);
        
    }
};

//post wise get comments of posts