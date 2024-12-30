import React, { useEffect, useState, useRef, useContext } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import { IoMdClose, IoMdPhotos } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ContextStore } from "../context/ContextStore";
import { div, p } from "motion/react-client";
import { useNavigate } from "react-router-dom";

const Editor = () => {
  const { serverUrl, userDetails } = useContext(ContextStore);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [editorData, setEditorData] = useState(null); // Track editor content
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [error, setError] = useState("");

  // TanStack Query mutation to save content
  const saveContent = useMutation({
    mutationFn: async (savedData) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/article/create`,
        {
          title,
          content: savedData.blocks,
          type,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Content saved:", data);
      setError("");
      navigate(`/articles`);
    },
    onError: (error) => {
      console.error("Error saving content:", error.message);
    },
  });
  // console.log(editorData);/

  useEffect(() => {
    const editor = new EditorJS({
      holder: editorRef.current,
      tools: {
        header: Header,
        paragraph: Paragraph,
        list: List,
      },
      onChange: async () => {
        const savedData = await editor.save(); // Capture content changes
        // console.log("Content changed:", savedData);
        setEditorData(savedData); // Optionally save it to state to display
      },
    });

    setEditorInstance(editor);

    // Check content right after initialization (e.g. for debugging)

    // Cleanup the editor when the component unmounts
    return () => {
      // if (editorInstance) {
      //   editorInstance.destroy();
      // }
    };
  }, []);

  // const handleIconClick = () => {
  //   fileInputRef.current.click();
  // };

  const handleSave = async () => {
    if (
      editorData &&
      editorData.blocks &&
      editorData.blocks.length > 0 &&
      title.length > 0 &&
      type.length > 0
    ) {
      console.log("Uploading content...");
      saveContent.mutate(editorData); // Only save if there is content
    } else {
      console.error("No content to save.");
      setError("Please fill in all required fields.");
    }
  };
  // console.log(userDetails);
  useEffect(() => {
    if (!userDetails?.name) {
      navigate("/login");
    }
  }, [userDetails]);

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="absolute top-[100px] left-[2%]   w-[80%] border-b text-xl outline-none"
        placeholder="Enter Title"
      />
      {error && <p className="text-red-500 ml-2 md:ml-7">{error}</p>}
      <select
        className="mt-20 ml-2 md:mt-24 md:ml-7 cursor-pointer outline-none"
        name="category"
        onChange={(e) => {
          setType(e.target.value); // Updates the type state with the selected value
          console.log(e.target.value); // Logs the selected value
        }}
      >
        <option value="">Select Type</option>
        <option value="Coding">Coding</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Sports">Sports</option>
        <option value="Photography">Photography</option>
        <option value="Other">Other</option>
      </select>

      <div
        ref={editorRef}
        className="mt-16 mx-auto max-w-[95%] sm:max-w-[80%]  bg-gray-100 p-2"
      ></div>

      <button
        onClick={handleSave}
        className="p-2 absolute top-[12%]  right-2  bg-green-500 rounded w-[100px] text-white font-bold"
      >
        Save
      </button>
    </div>
  );
};

export default Editor;
