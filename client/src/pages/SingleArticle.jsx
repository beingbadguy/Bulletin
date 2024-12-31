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

  const userdata = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axios.get(
        `${serverUrl}/api/v1/user/profile/${data?.data?.postedBy}`
      );
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const article = data.data;

  return (
    <div className="min-h-[85vh]">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-1 p-4">
        <p className="cursor-pointer text-xl" onClick={() => navigate("/")}>
          <TbSmartHome />
        </p>
        <MdOutlineKeyboardArrowRight />
        <p className="cursor-pointer" onClick={() => navigate("/articles")}>
          All Articles
        </p>
        <MdOutlineKeyboardArrowRight />
        <p className="text-red-500">{article.title.slice(0, 13) + "..."}</p>
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
          {article.blocks.map((block) => renderBlockContent(block))}
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to render each block of content with styling
const renderBlockContent = (block) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={block.id} className="mb-4 text-lg">
          {parseStyles(block.data.text)}
        </p>
      );
    case "header":
      return (
        <h3 key={block.id} className="text-xl font-semibold mb-4">
          {parseStyles(block.data.text)}
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
              {parseStyles(item.content)}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre key={block.id} className="bg-gray-200 p-2 my-4">
          <code>{block.data.code}</code>
        </pre>
      );
    case "marker":
      return (
        <mark key={block.id} className="bg-yellow-300">
          {block.data.text}
        </mark>
      );
    case "inlineCode":
      return (
        <code key={block.id} className="bg-gray-100 p-1">
          {block.data.text}
        </code>
      );
    case "link":
      return (
        <a
          key={block.id}
          href={block.data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {block.data.meta?.title || block.data.link}
        </a>
      );
    case "delimiter":
      return <hr key={block.id} className="my-6" />;
    default:
      return null;
  }
};

// Helper function to parse and handle styles like bold, italic, etc.
const parseStyles = (text) => {
  if (!text) return null;

  // Handle **bold** -> <strong>bold</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Handle *italic* -> <em>italic</em>
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Handle inline code `code` -> <code>code</code>
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");

  // Render the text with parsed HTML
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

export default SingleArticle;
