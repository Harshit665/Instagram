import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { BookMarked, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Posts = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText(""); // Clear the input if it only contains whitespace
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id != post?._id
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    const wasLiked = liked; // capture current state

    // Optimistically update UI
    setLiked(!wasLiked);
    setPostLike((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const action = wasLiked ? "dislikes" : "likes";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update Redux store
        const updatePostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: wasLiked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Error updating likeasdfegf"
      );
      // Rollback if API fails
      setLiked(wasLiked);
      setPostLike((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="Post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <h1>{post.author?.userName}</h1>
              {
                user?._id === post.author?._id && <Badge variant="secondary" className="bg-black text-white">Author</Badge>
              }
          </div>
          
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold hover:bg-[#ED4956] hover:text-white border"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit border">
              Add to favourite
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deleteHandler}
                variant="ghost"
                className="cursor-pointer w-fit border"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post_image"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <BookMarked className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLike} likes </span>
      <p className="flex">
        <span className="font-medium mr-2">{post.author.userName}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          view all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between mt-2">
        <input
          className="outline-none text-sm w-full"
          type="text"
          placeholder="add a comment"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Posts;
