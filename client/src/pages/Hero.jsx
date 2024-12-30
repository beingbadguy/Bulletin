import React from "react";
import { IoIosSearch } from "react-icons/io";
import { FaFreeCodeCamp } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa6";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="min-h-[70vh] flex flex-col items-center justify-center gap-4 w-full  "
    >
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 0.5, y: 50 }}
        transition={{
          repeat: Infinity, // Repeat infinitely
          repeatType: "reverse", // Alternate back and forth
          duration: 2, // Each move lasts 2 seconds
        }}
        className="absolute top-[30%] left-[20%] translate-x-[-50%] translate-y-[-50%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-blue-300 via-purple-500 to-indigo-800 blur-md opacity-50 mix-blend-multiply lg:hidden "
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 0.5, x: 50 }}
        transition={{
          repeat: Infinity, // Repeat infinitely
          repeatType: "reverse", // Alternate back and forth
          duration: 2, // Each move lasts 2 seconds
        }}
        className="absolute top-[70%] left-[10%] translate-x-[-50%] translate-y-[-50%] w-[150px] h-[150px] rounded-full bg-gradient-to-br from-blue-300 via-purple-500 to-indigo-800 blur-md opacity-50 mix-blend-multiply lg:hidden"
      ></motion.div>

      <h1 className="text-4xl font-bold text-center">What's in your mind?</h1>
      <div
        className="border  border-gray-400  rounded-md flex items-center justify-start w-[80%] md:w-[50%] lg:w-[40%] z-[9999] bg-white
      "
      >
        <IoIosSearch className="text-2xl ml-2 text-gray-400 " />
        <input
          type="text"
          placeholder="Type any topic to search"
          className="p-4 outline-none w-[100%] rounded-xl "
        />
      </div>
      <div className="flex items-center justify-center gap-4 z-[9999] flex-wrap mx-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-gray-100 p-2 rounded flex items-center gap-2 cursor-pointer"
          >
            {topic.icon}
            <button className="">{topic.name}</button>
          </div>
        ))}
      </div>

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
        className="size-[200px] rounded object-cover absolute left-[15%] top-[30%] hidden xl:block"
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
        className="size-[200px] rounded object-cover absolute left-[71%] top-[30%]  justify-center hidden xl:block"
      />
    </motion.div>
  );
};

export default Hero;
