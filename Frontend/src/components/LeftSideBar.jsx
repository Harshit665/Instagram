import React, { useState } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import Createpost from "./CreatePost";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);

  // ---------------- Handlers ----------------
  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const sideHandler = (value) => {
    if (value === "logout") {
      handleLogout();
    } else if (value === "Create") {
      setOpen(true);
    } else if (value === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (value === "Home") {
      navigate("/");
    } else if (value === "seacrh") {
      toast.message("Search coming soon!");
    } else if (value === "explore") {
      toast.message("Explore coming soon!");
    } else if (value === "messages") {
      toast.message("Messages coming soon!");
    } else if (value === "notifications") {
      toast.message("Notifications coming soon!");
    }
  };

  // ---------------- Sidebar Data ----------------
  const sidebarItems = [
    { value: "Home", icon: Home, label: "Home", path: "/" },
    { value: "seacrh", icon: Search, label: "Search" },
    { value: "explore", icon: TrendingUp, label: "Explore" },
    { value: "messages", icon: MessageCircle, label: "Messages" },
    { value: "notifications", icon: Heart, label: "Notifications" },
    { value: "Create", icon: PlusSquare, label: "Create" },
    { value: "Profile", icon: null, label: "Profile", isAvatar: true },
    { value: "logout", icon: LogOut, label: "Logout" },
  ];

  const isActive = (item) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.value === "Profile" && location.pathname.startsWith("/profile"))
      return true;
    return false;
  };

  const baseItemClasses =
    "group flex items-center gap-4 rounded-xl cursor-pointer select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const iconWrapClasses =
    "flex items-center justify-center h-8 w-8 shrink-0 rounded-md transition-transform duration-150 group-hover:scale-105";
  const labelClasses =
    "hidden md:inline-block text-sm font-medium tracking-wide transition-colors duration-150";

  return (
    <>
      <aside
        className="
          fixed top-0 left-0 z-20
          h-screen
          flex flex-col
          bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl
          border-r border-gray-200/40 dark:border-gray-700/40
          px-2 md:px-4 pt-4 pb-6
          w-16 md:w-56 lg:w-64
          shadow-lg
        "
      >
        {/* Logo / Brand */}
        <div className="px-1 md:px-2 mb-8 text-center md:text-left">
          <img
            src="/logo.png" // path to your logo in public folder
            alt="App Logo"
            className=" h-8 md:h-10 object-contain mx-auto md:mx-0"
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <li key={item.value}>
                  <div
                    onClick={() => sideHandler(item.value)}
                    tabIndex={0}
                    className={[
                      baseItemClasses,
                      "p-2 md:p-3",
                      active
                        ? "bg-blue-100/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                        : "hover:bg-gray-200/70 dark:hover:bg-gray-700/60 text-gray-800 dark:text-gray-200",
                    ].join(" ")}
                  >
                    {item.isAvatar ? (
                      <span
                        className={[
                          iconWrapClasses,
                          "ring-1 ring-gray-300 dark:ring-gray-600 group-hover:ring-blue-400 overflow-hidden",
                        ].join(" ")}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profilePicture} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </span>
                    ) : (
                      <span
                        className={[
                          iconWrapClasses,
                          active
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-200",
                        ].join(" ")}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                      </span>
                    )}
                    <span className={labelClasses}>{item.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Create Post Dialog */}
      <Createpost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSideBar;
