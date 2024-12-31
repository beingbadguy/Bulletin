import React, { useContext, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaFreeCodeCamp } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ContextStore } from "../context/ContextStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Hero = () => {
  const topics = [
    {
      name: "Coding",
      id: 1,
      icon: <FaFreeCodeCamp />,
    },
    {
      name: "Sports",
      id: 2,
      icon: <MdOutlineSportsSoccer />,
    },
    {
      name: "Photography",
      id: 3,
      icon: <FaCameraRetro />,
    },
    { name: "Other", id: 4, icon: <FaQuoteRight /> },
  ];

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

  const allArticles = data?.data;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredArticles = allArticles.filter((article) =>
      article.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResult(filteredArticles);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="min-h-[70vh] flex flex-col items-center justify-center gap-4 w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 0.5, y: 50 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
        }}
        className="absolute top-[30%] left-[20%] translate-x-[-50%] translate-y-[-50%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-blue-300 via-purple-500 to-indigo-800 blur-md opacity-50 mix-blend-multiply lg:hidden"
      ></motion.div>

      <h1 className="text-4xl font-bold text-center">What's on your mind?</h1>
      <div className="border border-gray-400 rounded-md flex items-center justify-start w-[80%] md:w-[50%] lg:w-[40%] z-[9999] bg-white">
        <IoIosSearch className="text-2xl ml-2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search articles"
          className="p-4 outline-none w-[100%] rounded-xl"
        />
      </div>

      <div className="flex items-center justify-center gap-4 z-[9999] flex-wrap mx-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-gray-100 p-2 rounded flex items-center gap-2 cursor-pointer"
          >
            {topic.icon}
            <button>{topic.name}</button>
          </div>
        ))}
      </div>

      {/* Search Result Overlay */}
      {searchResult && searchTerm.length > 2 && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9099999]"
          onClick={() => setSearchResult(null)}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-xl overflow-auto mx-6 ">
            <div className="border border-gray-400 rounded-md flex items-center justify-start w- z-[9999] bg-white">
              <IoIosSearch className="text-2xl ml-2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search articles"
                className="p-4 outline-none w-[100%] rounded-xl"
              />
            </div>
            {/* <h2 className="text-xl text-center font-bold mb-4">
              Search Results
            </h2> */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {searchResult.length > 0 ? (
                searchResult.map((article) => (
                  <div
                    key={article.id}
                    className="hover:bg-gray-50  rounded cursor-pointer"
                    onClick={() => navigate(`/articles/${article._id}`)}
                  >
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No results found. Try searching for something else.</p>
                  <button
                    className="mt-4 p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    onClick={() => navigate("/articles")}
                  >
                    See All Articles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* some random images  */}
      {/* left  */}
      <img
        src="https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="size-[200px] rounded object-cover absolute left-[1%] top-[55%]  justify-center border hidden lg:block"
      />
      <img
        src="https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?q=80&w=2649&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="size-[200px] rounded object-cover absolute left-[1%] top-[20%] hidden lg:block "
      />
      <img
        src="https://images.unsplash.com/photo-1496381273223-e4ad4e99f5b6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="size-[200px] rounded object-cover absolute left-[14%] top-[35%] hidden xl:block"
      />

      {/* right  */}
      <img
        src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="size-[200px] rounded object-cover absolute left-[80%] xl:left-[85%] top-[55%] hidden lg:block"
      />
      <img
        src="https://images.unsplash.com/photo-1732951340728-d8b726561d50?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="size-[200px] rounded object-cover absolute left-[80%] xl:left-[85%] top-[20%]   justify-center hidden lg:block"
      />
      <img
        src="https://images.unsplash.com/photo-1657524433787-a30cefc92661?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="size-[200px] rounded object-cover absolute left-[71%] top-[35%]  justify-center hidden xl:block"
      />
    </motion.div>
  );
};

export default Hero;
