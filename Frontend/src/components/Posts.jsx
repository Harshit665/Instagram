import React, { useState } from "react";
import {
  BookMarked,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import CommentDialog from "./CommentDialog";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Posts = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  // ---------------- Handlers ----------------
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const likeOrDislikeHandler = async () => {
    const wasLiked = liked;

    // Optimistic UI update
    setLiked(!wasLiked);
    setPostLike((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const action = wasLiked ? "dislikes" : "likes";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
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
      } else throw new Error(res.data.message);
    } catch (error) {
      toast.error("Failed to update like");
      // Rollback
      setLiked(wasLiked);
      setPostLike((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
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
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const openComments = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  };

  return (
    <div className="my-6 w-full max-w-sm mx-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 transition">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="cursor-pointer h-7 w-7 border border-gray-300">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium">{post.author?.userName}</h1>
            {user?._id === post.author?._id && (
              <Badge variant="secondary" className=" bg-black text-[10px] px-1 text-white">
                Author
              </Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer hover:text-blue-500" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="w-full text-[#ED4956] hover:bg-red-100"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="w-full hover:bg-gray-100">
              Add to favourite
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deleteHandler}
                variant="ghost"
                className="w-full hover:bg-gray-100"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="post_image"
        className="rounded-none w-full aspect-square object-cover"
      />

      {/* Actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              className="cursor-pointer text-red-600 hover:scale-110 transition"
              size={20}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className="cursor-pointer hover:text-red-500 transition"
              size={20}
            />
          )}
          <MessageCircle
            onClick={openComments}
            className="cursor-pointer hover:text-blue-500 transition"
            size={20}
          />
          <Send className="cursor-pointer hover:text-blue-500 transition" size={20} />
        </div>
        <BookMarked
          className="cursor-pointer hover:text-yellow-500 transition"
          size={20}
        />
      </div>

      {/* Likes */}
      <span className="px-3 text-sm font-semibold">{postLike} likes</span>

      {/* Caption */}
      <p className="px-3 text-sm mt-1">
        <span className="font-semibold">{post.author.userName} </span>
        {post.caption}
      </p>

      {/* Comments */}
      {comment.length > 0 && (
        <span
          onClick={openComments}
          className="px-3 text-xs text-gray-400 cursor-pointer hover:underline"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 outline-none text-sm bg-transparent"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-blue-500 cursor-pointer text-sm font-medium"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Posts;
