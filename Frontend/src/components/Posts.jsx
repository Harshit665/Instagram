import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { BookMarked, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Posts = () => {

    const [text, setText] = useState("");
    const [open,setOpen] = useState(false);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }
        else{
            setText(""); // Clear the input if it only contains whitespace
        }
    }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="Post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>Username</h1>
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
            {/* <Button variant="ghost" className="cursor-pointer w-fit border">
              Delete
            </Button> */}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src="https://images.unsplash.com/photo-1682687982107-14492010e05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
        alt="post_image"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />
      
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
            <FaRegHeart size={"22px"} className="cursor-pointer hover:text-gray-600"/>
            <MessageCircle onClick={()=>setOpen(true)} className="cursor-pointer hover:text-gray-600" />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <BookMarked className="cursor-pointer hover:text-gray-600" />
        </div>
      <span className="font-medium block mb-2">1k likes </span>
      <p className="flex">
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span onClick={()=>setOpen(true)} className="cursor-pointer text-sm text-gray-400">view all 10 comments</span>
        <CommentDialog open={open} setOpen={setOpen}/>
        <div className="flex items-center justify-between mt-2">
            <input className="outline-none text-sm w-full" type="text" placeholder="add a comment" value={text} onChange={changeEventHandler}/>
            {
                text && <span className="text-[#3BADF8]">Post</span>
            }
            
        </div>
    </div>
  );
};

export default Posts;
