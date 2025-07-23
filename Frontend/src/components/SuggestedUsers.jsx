import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  // rename locally (optional, just for clarity)
  const { SuggestedUsers: suggestedUsers = [] } = useSelector((store) => store.auth);

  return (
    <div className="my-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between text-sm mb-2">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all...</span>
      </div>

      {/* User Rows */}
      {suggestedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between w-full py-2"
        >
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage src={user?.profilePicture} alt="profile_picture" />
                <AvatarFallback className="bg-gray-400 text-sm">HK</AvatarFallback>
              </Avatar>
            </Link>

            <div className="font-semibold text-sm min-w-0">
              <h1 className="truncate">
                <Link to={`/profile/${user?._id}`}>{user?.userName}</Link>
              </h1>
              <span className="text-gray-600 text-xs block truncate">
                {user?.bio || "Bio here...."}
              </span>
            </div>
          </div>

          {/* Right: Follow Button */}
          <button
            className="ml-3 text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#549ecf] whitespace-nowrap"
            // onClick={() => handleFollow(user._id)} // plug in later
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
