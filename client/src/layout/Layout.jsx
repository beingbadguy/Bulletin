import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHandHolding, FaRegEdit, FaRegUser } from "react-icons/fa";
import { CiMenuFries, CiUser } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoBulbOutline, IoHomeOutline } from "react-icons/io5";
import { PiArticle } from "react-icons/pi";
import { TbBrandStorytel } from "react-icons/tb";
import { SlEnvolopeLetter } from "react-icons/sl";
import { ContextStore } from "../context/ContextStore";

const Layout = () => {
  const { userDetails } = useContext(ContextStore);

  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: <IoHomeOutline className="md:hidden" />,
    },
    {
      label: "Articles",
      path: "/articles",
      icon: <PiArticle className="md:hidden" />,
    },

    {
      label: "Newsletter",
      path: "/newsletter",
      icon: <SlEnvolopeLetter className="md:hidden" />,
    },
  ];

  const [menu, setMenu] = useState(false);

  if (menu) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return (
    <div>
      <motion.header
        initial={{ y: -100, opacity: 0 }} // Start 10px to the right
        animate={{ y: 0, opacity: 1 }} // End at the original position with full opacity
        transition={{ duration: 1 }}
        className="p-4 flex items-center justify-between font-bold bg-gray-100 text-black "
      >
        <p
          className="text-red-500 font-bold text-2xl cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          Bulletin
        </p>
        <div
          className={` ${
            menu ? "translate-x-0" : "-translate-x-[100%]"
          } transition-all duration-200 absolute top-0 left-0 h-screen w-full z-[10000] gap-4 text-xl pt-20 pl-5 bg-white flex-col md:h-auto md:translate-x-0 md:p-0 md:w-auto md:text-[16px] md:bg-transparent md:flex-row md:static md:items-center md:gap-12 flex`}
        >
          <IoMdClose
            className="absolute right-6 top-4 text-2xl md:hidden"
            onClick={() => {
              setMenu(false);
            }}
          />
          <div className="absolute left-6 top-4 text-2xl md:hidden text-emerald-500">
            Menu
          </div>
          <hr className=" absolute left-0 top-14 w-full z-[999] md:hidden" />
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.label}
              to={menuItem.path}
              className="flex items-center gap-2 text-black hover:text-gray-500 transition-all duration-200 cursor-pointer "
              onClick={() => {
                setMenu(false);
                navigate(menuItem.path);
              }}
            >
              {menuItem.icon}
              {menuItem.label}
            </Link>
          ))}
          <hr className=" absolute left-0 top-[260px] w-full z-[999] md:hidden" />
          <div className="absolute left-[20px] top-72 w-[90%] md:hidden ">
            <div className="flex items-center justify-center flex-col ">
              <h1 className="">
                Welcome to <span className="text-red-500  ">Bulletin.</span>
              </h1>
              <div className="text-center text-sm text-gray-500 flex items-center my-2 w-full flex-col bg-gray-100 rounded p-4 ">
                <div className="flex items-center gap-2">
                  Craft narratives <FaHandHolding className="text-yellow-500" />
                </div>{" "}
                <div className="flex items-center gap-2">
                  ignite inspiration <IoBulbOutline className="text-red-500" />
                </div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1561634109-465ffe688b50?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="h-72 w-[100%] rounded object-cover my-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 hover:text-gray-500 transition-all duration-200 cursor-pointer"
            onClick={() => {
              navigate("/write");
            }}
          >
            <FaRegEdit />
            <p>Write</p>
          </div>
          {userDetails?.name ? (
            <CiUser
              className="text-2xl cursor-pointer"
              onClick={() => {
                navigate("/user");
              }}
            />
          ) : (
            <p
              className="p-2 border border-gray-500 rounded-3xl px-5 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              <Link to={"/login"}>Login</Link>
            </p>
          )}
          <div
            className="text-2xl md:hidden"
            onClick={() => {
              setMenu(true);
            }}
          >
            <CiMenuFries />
          </div>
        </div>
      </motion.header>
      <div>
        <Outlet />
      </div>
      <footer className="p-4 flex items-center justify-center bg-gradient-to-r from-green-200 via-green-400 to-green-200 flex-col  ">
        <p className="text-black text-sm">
          {new Date().getFullYear()} Bulletin. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
