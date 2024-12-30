import { useMutation } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { ContextStore } from "../context/ContextStore";
import axios from "axios";
import { motion } from "framer-motion";
// import { MdAlternateEmail } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";

const Forget = () => {
  const { serverUrl } = useContext(ContextStore);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const forgetMutation = useMutation({
    mutationKey: ["forget"],
    mutationFn: async (email) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/auth/reset-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
      setError(data.message);
    },
    onError: (error) => {
      setError(error.response?.data.message);

      console.error("Error:", error.response?.data || error.message);
    },
  });
  const submitHandler = (e) => {
    e.preventDefault();
    forgetMutation.mutate(email);
  };
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <p className=" text-center p-4 text-lg text-black ">
        Enter Your Email Address
      </p>
      <form
        className="w-[80%] md:w-[50%]"
        onSubmit={(e) => {
          submitHandler(e);
        }}
      >
        <div className="flex items-center border pl-2 rounded">
          <AiOutlineMail className="size-5 text-gray-400 " />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border-none w-full  outline-none  "
          />
        </div>
        {error && (
          <motion.p
            className="text-red-500 my-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {error}
          </motion.p>
        )}
        <button
          type="submit"
          className="p-2 my-4 bg-emerald-500 rounded text-white w-full hover:bg-emerald-600 transition-all duration-200"
        >
          Send Verification Code
        </button>
      </form>
    </motion.div>
  );
};

export default Forget;
