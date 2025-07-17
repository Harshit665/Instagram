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
    <div className="flex items-center h-screen w-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col p-8 gap-5"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">logo</h1>
          <p className="text-center">Login to see photos and video</p>
        </div>
        <div>
          <span>Email</span>
          <Input
            type="email"
            value={inputValue.email}
            name="email"
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent w-80 my-2"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <span>Password</span>
          <Input
            type="password"
            value={inputValue.password}
            name="passWord"
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent w-80 my-2"
            placeholder="Enter your password"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-4 h-4 w-4 animate-spin" />
            please wait...
          </Button>
        ) : (
          <Button type="submit" className="bg-black text-white">
            Login
          </Button>
        )}

        <span className="text-center">
          don't have an account?
          <Link to="/signup" className="text-blue-600  ">
            register here
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
