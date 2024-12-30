import React, { useContext, useEffect, useState } from "react";
import { ContextStore } from "../context/ContextStore";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { HiOutlineEyeOff } from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi";

const Login = () => {
  const {
    serverUrl,
    setTempMail,
    tempmail,
    isAuth,
    setIsAuth,
    userDetails,
    setUserDetails,
  } = useContext(ContextStore);
  console.log(userDetails);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(null);

  useEffect(() => {
    if (userDetails?.name) {
      navigate("/user");
    }
  }, [userDetails]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const changeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Define the mutation function for signing up
  const loginMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/auth/login`,
        userData,

        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Send cookies with the request
        }
      );
      return response.data; // Assuming the response contains the result in `data`
    },
    onSuccess: (data) => {
      // console.log("Success:", data);
      console.log(data.data);
      console.log(user);
      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
        setUserDetails(data.data);
        navigate("/user");
      } else {
        setIsAuth(true);
        setTempMail(user.email);
        navigate("/verify");
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message);
      console.error("Error:", error.response?.data || error.message); // Log error details
    },
  });

  // Form submission handler
  const submitHandler = (e) => {
    e.preventDefault();
    loginMutation.mutate(user);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className=" min-h-[85vh] flex items-center justify-center flex-col w-full"
    >
      <h1 className="text-2xl font-bold text-center w-full">Login</h1>
      <div className="flex justify-center items-center w-[90%] sm:w-[60%] md:w-[50%] lg:w-[30%]">
        <form className="w-full" onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              onChange={changeHandler}
              value={user.email}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              onChange={changeHandler}
              value={user.password}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
            {showPassword ? (
              <HiOutlineEye
                className="absolute top-9 right-4 text-gray-500 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            ) : (
              <HiOutlineEyeOff
                className="absolute top-9 right-4 text-gray-500 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}
          </div>
          {error && <div className="text-red-500 my-2">{error}</div>}

          <div
            className="my-2 text-right cursor-pointer text-sm text-gray-500"
            onClick={() => {
              navigate("/forget");
            }}
          >
            Forget Password
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
          <div className="text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup">Signup</Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
