import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [inputValue, setInputvalue] = useState({
    userName: "",
    email: "",
    passWord: "",
  });

  const [loading, setLodading] = useState(false);
  const navigate = useNavigate();

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
        "http://localhost:8000/api/v1/user/register",
        inputValue,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/login"); // ensure correct route
        toast.success(response.data.message);
        setInputvalue({
          userName: "",
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
          "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", // lush green forest
      }}
    >
      {/* Animated Gradient Border */}
      <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 animate-border-spin">
        <form
          onSubmit={signupHandler}
          className="bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col gap-5 w-[360px] border border-white/20"
        >
          <div className="my-4">
            <h1 className="text-center font-extrabold text-3xl text-white tracking-wide">
              Logo
            </h1>
            <p className="text-center text-gray-200 text-sm">
              Sign up to see photos and videos
            </p>
          </div>

          <div>
            <span className="text-gray-100 font-medium">Username</span>
            <Input
              type="text"
              value={inputValue.userName}
              name="userName"
              onChange={changeEventHandler}
              className="focus-visible:ring-2 focus-visible:ring-emerald-400 w-full my-2 bg-white/20 text-white placeholder-gray-300 border border-emerald-400/30 rounded-md"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <span className="text-gray-100 font-medium">Email</span>
            <Input
              type="email"
              value={inputValue.email}
              name="email"
              onChange={changeEventHandler}
              className="focus-visible:ring-2 focus-visible:ring-emerald-400 w-full my-2 bg-white/20 text-white placeholder-gray-300 border border-emerald-400/30 rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <span className="text-gray-100 font-medium">Password</span>
            <Input
              type="password"
              value={inputValue.passWord}
              name="passWord"
              onChange={changeEventHandler}
              className="focus-visible:ring-2 focus-visible:ring-emerald-400 w-full my-2 bg-white/20 text-white placeholder-gray-300 border border-emerald-400/30 rounded-md"
              placeholder="Enter your password"
            />
          </div>

          {loading ? (
            <Button
              disabled
              className="bg-gradient-to-r from-emerald-500 to-green-400 text-white"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold"
            >
              Signup
            </Button>
          )}

          <span className="text-center text-gray-200 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-300 font-medium hover:underline"
            >
              Login here
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
