import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.util.js";
import { Post } from "../models/post.model.js";

//registration of the user
export const register = async (req, res) => {
  try {
    const { userName, email, passWord } = req.body;
    if (!userName || !email || !passWord) {
      return res.status(401).json({
        message: "something is missing -user controller.js",
        success: false,
      });
    }
    //checking whetehr user is already exists or not
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "user already exists -user controller.js",
        success: false,
      });
    }

    //encrypting the password
    const hashedPassword = await bcrypt.hash(passWord, 10);

    //saving in the database
    await User.create({
      userName,
      email,
      passWord: hashedPassword,
    });

    //return response
    return res.status(201).json({
      message: "user is registered in DB successfully controller.js",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//login user
export const login = async (req, res) => {
  try {
    const { email, passWord } = req.body;
    if (!(email, passWord)) {
      return res.status(401).json({
        message: "all fields are required -user.controller.js",
        success: false,
      });
    }

    //checking whether exists or not
    let user = await User.findOne({ email });
    if (!user) {
      return (
        res.status(401),
        json({
          message: "invalid credentials -user.controller.js",
          success: false,
        })
      );
    }

    // checking the passowrd correctness
    const isPassWordCorrect = await bcrypt.compare(passWord, user.passWord);
    if (!isPassWordCorrect) {
      return res.status(401).json({
        message: "incorrect password and email -user.controller.js",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //populate each postId in the post array
   const populatedPost = await Promise.all(
  user.posts.map(async (postId) => {
    const post = await Post.findById(postId);
    if (!post) return null; // Skip if post is not found
    if (post.author && post.author.equals(user._id)) {
      return post;
    }
    return null;
  })
);


    // creating the user object for return
    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: populatedPost
    };

    // generating the token
    
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.userName}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

//logout user
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "user logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get user Profile
export const getProfile = async (req, res) => {
  try {
    const userID = req.params.id;

    let user = await User.findById(userID).select("-passWord");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// edit profile section
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        messgae: "user not found --controller.js",
        success: false,
      });
    }

    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }
    if (profilePicture) {
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "profile updated --user controller.js",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

//suggested users
export const getSuggestedUser = async (req,res) => {
  try {
    const getSuggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-passWord"
    );
    if (!getSuggestedUser) {
      return res.status(400).json({
        message: "currently do not user",
      });
    }

    return res.status(201).json({
      success: true,
      users: getSuggestedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

//follow unfollow logic
export const followUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskoFollwKrunga = req.params.id;

    if (followKrneWala === jiskoFollwKrunga) {
      return res.status(400).json({
        messgae: "you can not follow and unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollwKrunga);

    if (!user || !targetUser) {
      return res.status(401).json({
        message: "user not found --followUnfollow",
        success: false,
      });
    }

    //checking whether to follow or to unfollow
    const isFollowing = user.following.includes(jiskoFollwKrunga);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollwKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollwKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "unfollwed successfully",
        success: true,
      });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollwKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollwKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "follwed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
