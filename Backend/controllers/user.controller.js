import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//registration of the user
export const register = async (req, res) => {
  try {
    const { userName, email, passWord } = req.body;
    if (!(userName || email || passWord)) {
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
      hashedPassword,
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
      return (
        res.status(401),
        json({
          message: "all fields are required -user.controller.js",
          success: false,
        })
      );
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
      return (
        res.status(401),
        json({
          message: "incorrect password and email -user.controller.js",
          success: false,
        })
      );
    }

    // creating the user object for return
    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: user.post,
    };

    // generating the token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
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

export const getProfile = async ()=>{
    
}
