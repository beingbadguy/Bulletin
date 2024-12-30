import React from "react";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PasswordChangeConfirmPage = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center flex-col"
    >
      <div className="font-bold text-2xl flex items-center flex-col gap-4">
        <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center text-white">
          <TiTick />
        </div>
        All done
      </div>
      <h1 className="text-gray-500 my-4">
        Your Password as been changed Successfully!
      </h1>
      <p
        onClick={() => {
          navigate("/login");
        }}
        className="p-2 bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-white rounded w-[30%] text-center font-bold"
      >
        Login
      </p>
    </motion.div>
  );
};

export default PasswordChangeConfirmPage;
