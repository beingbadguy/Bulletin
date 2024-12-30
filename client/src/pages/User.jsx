import React, { useContext, useEffect } from "react";
import { ContextStore } from "../context/ContextStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const User = () => {
  const { userDetails, serverUrl } = useContext(ContextStore);
  const navigate = useNavigate();

  // console.log(userDetails);

  // Fetch the user details
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const response = await axios.get(`${serverUrl}/api/v1/user/me`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (!userDetails) {
      navigate("/login");
    }
  }, [userDetails]);

  const logoutMutation = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      const response = await axios.post(`${serverUrl}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error.response?.data || error.message);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="p-4 min-h-screen"
    >
      <h1>User Details</h1>
      {userDetails && (
        <div className="">
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Verified: {userDetails.isVerified ? "True" : "False"}</p>
          {/* Add other fields from `data` that are available */}
        </div>
      )}
      <div
        className="p-2 bg-red-500 hover:bg-red-600 cursor-pointer w-32 text-white text-center mt-4 rounded "
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </div>
    </motion.div>
  );
};

export default User;
