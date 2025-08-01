import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback className="bg-gray-400 text-sm">HK</AvatarFallback>
          </Avatar>
        </Link>

        <div className="font-semibold text-sm">
          <h1><Link to={`/profile/${user?._id}`}>{user?.userName}</Link></h1>
          <span className="text-gray-600 text-sm">{user?.bio || "Bio here...."}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  );
};

export default RightSideBar;
