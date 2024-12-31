import React, { useContext, useEffect, useState } from "react";
import { ContextStore } from "../context/ContextStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CiLogout } from "react-icons/ci";
import { TbEditOff } from "react-icons/tb";
import { formatDistanceToNow } from "date-fns";
import { MdDeleteOutline } from "react-icons/md";

const User = () => {
  const { userDetails, serverUrl } = useContext(ContextStore);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ViewUserArticles, setViewUserArticles] = useState(true);

  const truncateText = (text = "", limit = 100) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const userArticles = useQuery({
    queryKey: ["userarticles"],
    queryFn: async () => {
      const response = await axios.get(
        `${serverUrl}/api/v1/article/all-article`
      );
      return response.data;
    },
  });

  const articlesCreatedByUser = userArticles?.data?.data.filter((art, inde) => {
    return art.postedBy === userDetails._id;
  });

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const response = await axios.get(`${serverUrl}/api/v1/user/me`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
  // console.log(data?.user);

  useEffect(() => {
    if (!userDetails) {
      navigate("/login");
    }
  }, [userDetails]);

  const logoutMutation = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      const response = await axios.post(
        `${serverUrl}/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error.response?.data || error.message);
    },
  });

  // delete handler
  const deleteMutation = useMutation({
    mutationKey: ["articles"],
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${serverUrl}/api/v1/article/single/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
      queryClient.invalidateQueries(["userarticles", "articles"]);
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
      className="p-2 min-h-screen"
    >
      {userDetails && (
        <div className="">
          <div className=" flex items-center gap-2 justify-between">
            <div className="size-20  rounded-full   overflow-hidden">
              <img src="./user.png" alt="" className="" />
            </div>
            <div>{articlesCreatedByUser?.length} Articles</div>
            <div>0 Followers</div>
            <div>0 Following</div>
          </div>
          <hr className="my-2" />

          <p>{userDetails.name}</p>
          <p>{userDetails.email}</p>

          {/* Add other fields from `data` that are available */}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div
          className="p-2 bg-emerald-500 hover:bg-emerald-600 cursor-pointer w-[49%] md:w-32 text-white text-center mt-4 rounded flex items-center gap-2 justify-center"
          onClick={() => {}}
        >
          <TbEditOff /> Edit Profile
        </div>{" "}
        <div
          className="p-2 bg-red-500 hover:bg-red-600 cursor-pointer  w-[49%] md:w-32 text-white text-center mt-4 rounded flex items-center gap-2 justify-center"
          onClick={() => {
            handleLogout();
          }}
        >
          <CiLogout /> Logout
        </div>
      </div>

      <hr className="my-2" />
      <div className="flex items-center justify-between">
        <p
          className={`p-1 font-bold w-[49%] md:w-[200px] flex items-center justify-center rounded  cursor-pointer ${
            ViewUserArticles ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            setViewUserArticles(true);
          }}
        >
          Your Articles
        </p>
        <p
          className={`p-1 font-bold w-[49%] md:w-[200px] flex items-center justify-center rounded  cursor-pointer ${
            ViewUserArticles ? "" : "bg-gray-100"
          }`}
          onClick={() => {
            setViewUserArticles(false);
          }}
        >
          Saved Articles
        </p>
      </div>
      {ViewUserArticles ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
          {articlesCreatedByUser?.map((article) => (
            <div
              key={article._id}
              className="rounded-lg p-4 border shadow-sm hover:shadow-md   bg-white cursor-pointer transition-shadow duration-200"
              onClick={() => {
                navigate(`/articles/${article._id}`);
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold mb-2 text-gray-500">
                  {article.type}
                </h2>
                <p className="text-sm text-emerald-600">
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between flex-wrap my-2 ">
                <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
                <MdDeleteOutline
                  className="text-xl hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    const canDelete = confirm(
                      "Do You want to delete this article?"
                    );
                    if (canDelete) {
                      deleteMutation.mutate(article._id);
                    }
                  }}
                />
              </div>
              <div className="space-y-3 text-gray-500">
                {article.blocks?.length ? (
                  article.blocks.map(
                    (block, index) =>
                      index === 0 && (
                        <p key={block.id} className="text-gray-400">
                          {truncateText(block.data.text, 100)}
                        </p>
                      )
                  )
                ) : (
                  <p className="text-gray-500">No content available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2">We are working on this funtionality</p>
      )}
    </motion.div>
  );
};

export default User;
