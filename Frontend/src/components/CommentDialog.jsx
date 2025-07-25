import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
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
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col md:flex-row w-[95vw] md:w-[80vw] lg:w-[70vw] h-[90vh] p-0 overflow-hidden rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl transition-all duration-300"
        onInteractOutside={() => setOpen(false)}
      >
        {/* Left: Image Section */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <img
            src={selectedPost?.image}
            alt="Post"
            className="object-contain max-h-full max-w-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Right: Comment / Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-5 bg-gradient-to-br from-white/70 to-gray-100/60 dark:from-gray-800/70 dark:to-gray-900/70">
          {/* User Info */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-300/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <Link>
                <Avatar className="ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400 transition">
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback delayMs={0}>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className="font-semibold text-sm hover:text-blue-500 transition-colors">
                  {selectedPost?.author?.userName}
                </Link>
              </div>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="mt-2 cursor-pointer hover:text-blue-500 transition" />
                </DialogTrigger>
                <DialogContent className="p-3 rounded-xl shadow-md">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold hover:bg-red-100 px-2 py-1 rounded">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full hover:bg-gray-100 px-2 py-1 rounded">
                    Add to favourites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 flex-col flex overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent mt-2 space-y-2">
            {comment.map((c) => (
              <Comment key={c._id} comment={c} />
            ))}
          </div>

          {/* Add Comment */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <input
                onChange={changeEventHandler}
                value={text}
                type="text"
                placeholder="Add a comment..."
                className="w-full outline-none border text-sm border-gray-300 p-2 rounded-lg bg-white/60 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-400 transition"
              />
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                variant="outline"
                className="border-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
