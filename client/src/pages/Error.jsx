import React from "react";
import { AiOutlineHome, AiOutlinePhone } from "react-icons/ai";
import { motion } from "framer-motion";

const Error = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col justify-center items-center "
    >
      {/* Illustration */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 h-32 text-emerald-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 11H9v2h6v-2zm0-4H9v2h6V9z" />
        </svg>
      </div>

      {/* Error Title */}
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex space-x-4">
        {/* Home Button */}
        <a
          href="/"
          className="flex items-center px-6 py-3 text-white bg-emerald-500 hover:bg-emerald-600 rounded-md shadow-md transition"
        >
          <AiOutlineHome className="mr-2 text-2xl" />
          Go Back Home
        </a>
      </div>
    </motion.div>
  );
};

export default Error;
