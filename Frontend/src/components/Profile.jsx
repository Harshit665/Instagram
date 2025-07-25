import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile,user } = useSelector((store) => store.auth);
  const isLoggedInUser = user?._id === userProfile?._id;
  const isFollowing = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookMarks;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="flex justify-center items-start">
          <Avatar className="w-32 h-32 shadow-lg border border-gray-300">
            <AvatarImage src={userProfile?.profilePicture} alt="profilePhoto" />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">{userProfile?.userName}</h2>

            {isLoggedInUser ? (
              <>
                <div className="flex gap-2">
                  <Link
                    to="/account/edit"
                    className="bg-gray-200 rounded-md flex px-3 items-center hover:bg-black hover:text-white py-1"
                  >
                    Edit Profile
                  </Link>
                  <Link className="bg-gray-200 rounded-md flex px-3 items-center hover:bg-black hover:text-white py-1">
                    View Archive
                  </Link>
                  <Link className="bg-gray-200 rounded-md flex px-3 items-center hover:bg-black hover:text-white py-1">
                    Add Tool
                  </Link>
                </div>
              </>
            ) : isFollowing ? (
              <>
                <Button className="h-8 text-sm bg-[#0095F6] text-white hover:bg-[#007dc1]">
                  Message
                </Button>
                <Button className="h-8 text-sm bg-[#0095F6] text-white hover:bg-[#007dc1]">
                  Unfollow
                </Button>
              </>
            ) : (
              <Button className="h-8 text-sm bg-[#0095F6] text-white hover:bg-[#007dc1]">
                Follow
              </Button>
            )}
          </div>

          <div className="flex gap-6 text-sm">
            <p>
              <span className="font-semibold">{userProfile?.posts.length}</span>{" "}
              Posts
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.followers.length}
              </span>{" "}
              Followers
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.following.length}
              </span>{" "}
              Following
            </p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">
              {userProfile?.bio || "No bio provided"}
            </span>
            <Badge
              variant="secondary"
              className="w-fit text-sm flex items-center gap-1"
            >
              <AtSign size={14} />
              {userProfile?.userName}
            </Badge>
            <span>🤯 Learn code with me</span>
            <span>🔥 Building cool stuff</span>
            <span>📚 Sharing knowledge</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-t border-gray-200">
        <div className="flex justify-center gap-6 text-sm py-3">
          {["posts", "saved", "reels", "tags"].map((tab) => (
            <span
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`cursor-pointer transition-all duration-200 px-2 py-1 border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 font-semibold text-blue-600"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {tab.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="">
          <div className=" ml-20 grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {displayedPost?.length > 0 ? (
              displayedPost.map((post) => (
                <div
                  key={post?._id}
                  className="relative group overflow-hidden rounded-md"
                >
                  <img
                    src={post.image}
                    alt="postImage"
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex text-white space-x-4">
                      <button className="flex gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                No posts to display.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
