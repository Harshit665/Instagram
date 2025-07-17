import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    }
    else{
      setText("");
    }
  };

  const sendMessageHandler = async () =>{
    alert(text)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col md:flex-row w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] p-0 overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-900"
        onInteractOutside={() => setOpen(false)}
      >
        {/* Left: Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1682687982107-14492010e05e?w=500&auto=format&fit=crop&q=60"
            alt="Post"
            className="object-contain max-h-full max-w-full"
          />
        </div>

        {/* Right: Comment / Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-4 bg-gray-50 dark:bg-gray-800">
          {/* User Info */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <div className="flex items-center gap-3">
              <Link>
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback delayMs={0}>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className="font-semibold text-xs">Username</Link>
              </div>
            </div>
            <div>
              <Dialog>
                <DialogTrigger aschild>
                  <MoreHorizontal className="mt-2 cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favourites</div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr />
          <div className="flex-1 flex-col flex overflow-y-auto max-h-96">
            comments aayenge
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <input
              onChange={changeEventHandler}
              value={text}
                type="text"
                placeholder="add comment..."
                className="w-full outline-none border border-gray-300 p-2 rounded"
              />
              <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
