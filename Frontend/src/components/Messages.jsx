import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();
  const {Messages} = useSelector((store) => store.chat);


  return (
    <div className=" flex-1 p-4 overflow-y-auto">
      <div className="flex flex-col items-center min-w-[250px]">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
          <AvatarFallback>
            {selectedUser?.userName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-lg font-semibold text-gray-900 mb-3">
          {selectedUser?.userName}
        </span>
        <Link
          to={`/profile/${selectedUser?._id}`}
          className="px-4 py-2 bg-black text-white rounded-md text-sm transition hover:bg-gray-800"
        >
          View Profile
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {
        Messages && Messages.map((msg) => {
          return (
            <div key={msg} className={`flex`}>
              <div>
                {msg}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
