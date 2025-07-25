import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice.js";

const Login = () => {
  const [inputValue, setInputvalue] = useState({
    email: "",
    passWord: "",
  });

  const [loading, setLodading] = useState(false);
  const naviagte = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInputvalue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLodading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        inputValue,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        naviagte("/");
        toast.success(response.data.message);
        setInputvalue({
          email: "",
          passWord: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setLodading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1673697239981-389164b7b87f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=100')",
      }}
    >
      {/* Animated Border Wrapper */}
      <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 animate-border-spin">
        <form
          onSubmit={signupHandler}
          className="bg-black/60 rounded-2xl shadow-2xl p-8 flex flex-col gap-5 w-[360px] border border-white/20"
        >
          <div className="my-4">
            <h1 className="text-center font-extrabold text-3xl text-white tracking-wide">
              Logo
            </h1>
            <p className="text-center text-gray-200">
              Login to see photos and videos
            </p>
          </div>
          <div>
            <span className="text-gray-100 font-medium">Email</span>
            <Input
              type="email"
              value={inputValue.email}
              name="email"
              onChange={changeEventHandler}
              className="focus-visible:ring-2 focus-visible:ring-purple-400 w-full my-2 bg-white/20 text-white placeholder-gray-300 border border-gray-500 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <span className="text-gray-100 font-medium">Password</span>
            <Input
              type="password"
              value={inputValue.password}
              name="passWord"
              onChange={changeEventHandler}
              className="focus-visible:ring-2 focus-visible:ring-purple-400 w-full my-2 bg-white/20 text-white placeholder-gray-300 border border-gray-500 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          {loading ? (
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
              <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold"
            >
              Login
            </Button>
          )}

          <span className="text-center text-gray-200">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-yellow-300 hover:underline">
              Register here
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
