import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile } = useSelector((store) => store.auth);
  const isLoggedInUser = true;
  const isFollowing = true;

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10 my-5">
      <div className="grid grid-cols-2">
        <section className="flex items-center justify-center">
          <Avatar className="w-32 h-32 bg-gray-600">
            <AvatarImage src={userProfile?.profilePicture} alt="profilePhoto" />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>
        </section>
        <section className="py-6">
          <div className="flex flex-col gap-5 ">
            <div className="flex items-center gap-2">
              <span>{userProfile?.userName}</span>
              {isLoggedInUser ? (
                <>
                  <Button
                    variant="secondary"
                    className="bg-gray-300 hover:bg-gray-200 h-8"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 h-8 bg-gray-300"
                  >
                    View archive
                  </Button>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 h-8 bg-gray-300"
                  >
                    Add tool
                  </Button>
                </>
              ) : isFollowing ? (
                <>
                  <Button
                    variant="secondary"
                    className="hover:bg-[#6bb9dd] h-8 bg-[#0095F6] text-white text-sm"
                  >
                    Message
                  </Button>
                  <Button
                    variant="secondary"
                    className="hover:bg-[#6bb9dd] h-8 bg-[#0095F6] text-white text-sm"
                  >
                    Unfollow
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="hover:bg-[#6bb9dd] h-8 bg-[#0095F6]"
                >
                  Follow
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p><span className="font-semibold">{userProfile?.posts.length} </span>Posts</p>
              <p><span className="font-semibold">{userProfile?.followers.length} </span>followers</p>
              <p><span className="font-semibold">{userProfile?.following.length} </span>following</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">{userProfile?.bio} || bio here....</span>
              <Badge variant="secondary" className="w-fit text-md"><AtSign/>{userProfile?.userName}</Badge>
              <span>🤯Learn code with me</span>
              <span>🤯Learn code with me</span>
              <span>🤯Learn code with me</span>
            </div>
          </div>
        </section>
        <div>
          
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
