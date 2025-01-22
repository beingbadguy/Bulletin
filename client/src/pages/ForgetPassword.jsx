import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { ContextStore } from "../context/ContextStore";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ForgetPassword = () => {
  const { serverUrl } = useContext(ContextStore);

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const { token } = useParams();

  const passwordMutation = useMutation({
    mutationKey: ["password"],
    mutationFn: async (password) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/auth/reset-password/${token}`,
        { password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // console.log("Success:", data);
      setError(data.message);
      navigate("/success");
    },
    onError: (error) => {
      setError(error.response?.data.message);
      console.error("Error:", error.response?.data || error.message);
    },
  });

  const submitHandler = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // TODO: Send password reset link to user's email
    setError("");
    passwordMutation.mutate(password);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center flex-col"
    >
      <p className="text-2xl font-bold">Set new password</p>

      <p className="text-gray-400 mt-2">
        Password must be atleast 8 characters
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
        className="mt-4 w-[80%] md:w-[50%]"
      >
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border w-full  outline-green-500 rounded"
        />
        <div className="py-2"></div>
        <label htmlFor="confirmPassword" className="mt-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 border w-full  outline-green-500 rounded"
        />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-red-500 my-2 w-full"
          >
            {error}
          </motion.p>
        )}
        <button
          type="submit"
          className="p-2 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 w-full mt-4 rounded text-white font-bold"
        >
          Change Password
        </button>
      </form>
    </motion.div>
  );
};

export default ForgetPassword;
