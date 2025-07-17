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
        navigate("login");
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
    <div className="flex items-center h-screen w-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col p-8 gap-5"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">logo</h1>
          <p className="text-center">signup to see photos and video</p>
        </div>
        <div>
          <span>Username</span>
          <Input
            type="text"
            value={inputValue.username}
            name="userName"
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent w-80 my-2"
            placeholder="Enter your username"
          />
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
          <Loader2 className="mr-2 h-4 w-4" />
        ) : (
          <Button type="submit" className="bg-black text-white">
            Signup
          </Button>
        )}

        <span className="text-center">
          already have an account?
          <Link to="/login" className="text-blue-600  ">
            Login here
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
