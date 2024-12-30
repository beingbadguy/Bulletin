import React, { useContext, useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ContextStore } from "../context/ContextStore";
import { IoMailUnreadOutline } from "react-icons/io5";

const Newsletter = () => {
  const { serverUrl } = useContext(ContextStore);
  const [email, setEmail] = useState("");
  const [error, setError] = useState();

  const newsletterMutation = useMutation({
    mutationFn: async (email) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/newsletter/subscribe`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      setError(data.message);
    },
    onError: (error) => {
      console.error(error.response.data.message);
      setError(error.response.data.message);
    },
  });
  const subscribeHandler = () => {
    if (!email) {
      setError("Please enter an email address.");
      return;
    } else {
      newsletterMutation.mutate(email);
      setEmail("");
    }
  };
  return (
    <motion.div
      initial={{ y: -1000 }}
      animate={{ y: 0 }}
      transition={{ delay: 0 }}
      className="min-h-[79vh]  flex items-center justify-center flex-col  m-4"
    >
      <div className="flex items-center justify-center flex-col gap-3 text-center">
        <IoMailUnreadOutline className="size-20 text-emerald-500" />
        <h1 className="text-3xl ">Subscribe to our Newsletter!</h1>
        <p className="text-gray-400 text-center">
          Sign up for our newsletter to receive exclusive updates, promotions,
          and offers.
        </p>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-red-500"
          >
            {error}
          </motion.p>
        )}
        <div className="flex justify-center items-center gap-3 w-full flex-wrap">
          <div className="flex items-center gap-2 ml-1  border-2 my-2 rounded border-emerald-300 w-full">
            <MdAlternateEmail className="ml-2 text-2xl text-emerald-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="   md:w-[500px] p-2  outline-none rounded"
            />
          </div>

          <p
            className="p-2 bg-emerald-500 text-white rounded cursor-pointer hover:bg-emerald-600 w-[50%]"
            onClick={() => {
              subscribeHandler();
            }}
          >
            Subscribe
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Newsletter;
