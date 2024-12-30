import React, { useContext } from "react";
import { ContextStore } from "../context/ContextStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TbSmartHome } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
// Utility to truncate text
const truncateText = (text = "", limit = 100) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const Article = () => {
  const { serverUrl } = useContext(ContextStore);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await axios.get(
        `${serverUrl}/api/v1/article/all-article`
      );
      return response.data;
    },
  });
  console.log(data?.data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // transition={{ delay: 0 }}
      className="min-h-[84vh]"
    >
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
        <p className="text-red-500">All Articles</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
        {data?.data?.map((article) => (
          <div
            key={article._id}
            className="rounded-lg p-4 border shadow-sm hover:shadow-md   bg-white cursor-pointer transition-shadow duration-200"
            onClick={() => {
              navigate(`/articles/${article._id}`);
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-2 text-gray-500">{article.type}</h2>
              <p className="text-sm text-emerald-600">
                {formatDistanceToNow(new Date(article.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center justify-between flex-wrap my-2 ">
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
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
    </motion.div>
  );
};

export default Article;
