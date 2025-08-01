import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode, Send, Search,MessageCircle } from "lucide-react";
import Messages from "./Messages";

const ChatPage = () => {
  const { user, SuggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const isOnline = true;
  const dispatch = useDispatch();

  return (
    <div className="flex ml-[20%] h-screen bg-gray-50">
      
      <section className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                {user?.userName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-xl text-gray-800">{user?.userName}</h1>
              <span className={`text-sm ${isOnline ? "text-green-600" : "text-red-600"}`}>
                {isOnline ? "online" : "offline"}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Suggested Users
            </h3>
            {(SuggestedUsers || []).map((suggestedUser) => (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedUser?._id === suggestedUser._id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {suggestedUser?.userName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate">
                      {suggestedUser?.userName}
                    </span>
                    <span className="text-xs text-gray-500">2m</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {selectedUser ? (
        <section className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {selectedUser?.userName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedUser?.userName}</h3>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                <span className={`text-sm ${isOnline ? "text-green-600" : "text-red-600"}`}>
                  {isOnline ? "online" : "offline"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <Messages selectedUser ={selectedUser} />

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder={`Message ${selectedUser?.userName}...`}
                />
              </div>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircleCode className="w-16 h-16 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Messages</h2>
            <p className="text-gray-600 mb-6">
              Select a conversation from the sidebar to start chatting, or search for someone new.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">
              Start New Chat
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ChatPage;
