import mongoose, { Types } from "mongoose";

const userSchema = new mongooseSchema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passWord: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  bookMarks:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }]
},{timestamps:true});

export const User = mongoose.model("User", userSchema);
