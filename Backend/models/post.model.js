import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }]
})

export const Post = mongoose.model("Post",postSchema);