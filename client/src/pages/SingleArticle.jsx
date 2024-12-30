import React, { useContext, useEffect, useState } from "react";
import {
  MdOutlineDeleteOutline,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TbSmartHome } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { ContextStore } from "../context/ContextStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const SingleArticle = () => {
  const { serverUrl, userDetails } = useContext(ContextStore);
  const navigate = useNavigate();
  const { id } = useParams();

  const [canDelete, setCanDelete] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch single article data
  const { data, isLoading, error } = useQuery({
    queryKey: ["singleArticle", id],
    queryFn: async () => {
      const response = await axios.get(
        `${serverUrl}/api/v1/article/single/${id}`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (userDetails && userDetails._id === data?.data?.postedBy) {
      setCanDelete(true);
    }
  });

  // console.log(userDetails._id);
  // console.log(data?.data?.postedBy);

  const userdata = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axios.get(
        `${serverUrl}/api/v1/user/profile/${data?.data?.postedBy}`
      );
      return response.data;
    },
  });

  // console.log(userdata?.data?.user);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const article = data.data;
  // console.log(article.createdAt);

  return (
    <div className="min-h-[85vh]">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-1 p-4">
        <p
          className="cursor-pointer text-xl"
          onClick={() => {
            navigate("/");
          }}
        >
          <TbSmartHome />
        </p>
        <MdOutlineKeyboardArrowRight />
        <p
          className="cursor-pointer"
          onClick={() => {
            navigate("/articles");
          }}
        >
          All Articles
        </p>
        <MdOutlineKeyboardArrowRight />
        <p className="text-red-500">{article.title}</p>
      </div>

      {/* Article details */}
      <motion.div
        initial={{ x: -1000 }}
        animate={{ x: 0 }}
        transition={{ delay: 0 }}
        className="p-4"
      >
        <div className="font-bold text-sm my-5 text-emerald-800 flex items-center justify-between">
          Posted By : {userdata?.data?.user?.name}
          <p className="text-sm ">
            {formatDistanceToNow(new Date(article.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex items-center justify-between flex-wrap">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-emerald-600 mb-4 bg-green-50 p-1">
            Category: {article.type}
          </p>
        </div>

        {/* Render blocks */}
        <div className="article-content">
          {article.blocks.map((block) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p key={block.id} className="mb-4 text-lg">
                    {block.data.text}
                  </p>
                );
              case "header":
                return (
                  <h3 key={block.id} className="text-xl font-semibold mb-4">
                    {block.data.text}
                  </h3>
                );
              case "list":
                return (
                  <ul
                    key={block.id}
                    className={`list-disc pl-6 mb-4 ${
                      block.data.style === "ordered" ? "list-decimal" : ""
                    }`}
                  >
                    {block.data.items.map((item, index) => (
                      <li key={index} className="mb-2">
                        {item.content}
                      </li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SingleArticle;
