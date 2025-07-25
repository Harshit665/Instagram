import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const EditProfile = () => {
  const user = useSelector((store) => store.auth.user);

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section>
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback className="bg-gray-400 text-sm">HK</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="font-bold text-sm">{user?.userName}</h1>
            <span className="text-gray-600">
              {user?.bio || "Bio here..."}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
