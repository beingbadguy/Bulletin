import React, { useContext, useState } from "react";
import { ContextStore } from "../context/ContextStore";
import App from "../App";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const VerificationPage = () => {
  const { serverUrl, tempmail, isAuth, setUserDetails, setIsAuth } =
    useContext(ContextStore);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isAuth) {
    return (window.location.href = "/");
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get(`${serverUrl}/api/v1/user/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "User details not found!");
      console.error("Error:", error.response?.data || error.message);
    },
  });

  const verifyMutate = useMutation({
    mutationFn: async (code) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/auth/verify`,
        { code },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);

      localStorage.setItem("user", JSON.stringify(data.data));
      setUserDetails(data.data);
      setIsAuth(false);
      navigate("/user");
    },
    onError: (error) => {
      setError(error.response?.data?.message);
      console.error("Error:", error.response?.data || error.message);
    },
  });

  const verifyHandler = (e) => {
    e.preventDefault();
    // send token to server for verification
    verifyMutate.mutate(code);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-[85vh] flex items-center justify-center flex-col w-full"
    >
      <div className="text-2xl text-center flex items-center flex-col gap-2">
        Enter the Verification Code sent to{" "}
        <p className="text-gray-400 text-lg">{tempmail}</p>
      </div>
      <input
        type="tel"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter the 6 digit code"
        className="my-4 p-4 border text-emerald-900 border-emerald-500 outline-none rounded w-[40%] text-center font-bold "
        maxLength={6}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-red-500 my-2"
        >
          {error}
        </motion.p>
      )}

      <button
        className="p-2 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 text-white rounded w-[40%] "
        onClick={(e) => {
          verifyHandler(e);
        }}
      >
        Proceed
      </button>
    </motion.div>
  );
};

export default VerificationPage;
