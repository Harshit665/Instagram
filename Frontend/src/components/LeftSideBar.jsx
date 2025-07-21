import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import Createpost from "./CreatePost";


const LeftSideBar = () => {
     const navigate = useNavigate();
     const {user} = useSelector(store=>store.auth);
     const dispatch = useDispatch();
     const [open,setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sideHandler = (textType) => {
    if (textType === "logout") {
      handleLogout();
    }
    else if(textType === "Create"){
     setOpen(true);
    }
  };

 
  const sidebarItems = [
  {
    icon: <Home />,
    text: "Home",
  },
  {
    icon: <Search />,
    text: "seacrh",
  },
  {
    icon: <TrendingUp />,
    text: "explore",
  },
  {
    icon: <MessageCircle />,
    text: "messages",
  },
  {
    icon: <Heart />,
    text: "notifications",
  },
  {
    icon: <PlusSquare />,
    text: "Create",
  },
  {
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "profile",
  },
  {
    icon: <LogOut />,
    text: "logout",
  },
];

  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen flex flex-col">
      <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
      <div>
        {sidebarItems.map((item, index) => {
          return (
            <div
              onClick={() => sideHandler(item.text)}
              key={index}
              className="flex item-center gap-4 relative hover:bg-gray-200 cursor-pointer p-3 rounded-md my-3"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
      <Createpost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSideBar;
