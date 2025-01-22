import { useContext, useEffect, useState } from "react";
import NewEditor from "../components/NewEditor";
import { useNavigate } from "react-router-dom";
import { ContextStore } from "../context/ContextStore";
import { useMutation } from "@tanstack/react-query";
import { div } from "motion/react-client";
import axios from "axios";

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "You Can Start Writing from here...",
        level: 1,
      },
    },
  ],
};

function NewCreate() {
  const { serverUrl, userDetails } = useContext(ContextStore);

  const [data, setData] = useState(INITIAL_DATA);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [error, setError] = useState("");

  const saveContent = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${serverUrl}/api/v1/article/create`,
        {
          title,
          content: data.blocks,
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

  const handleSave = async () => {
    if (
      data &&
      data.blocks &&
      data.blocks.length > 0 &&
      title.length > 0 &&
      type.length > 0
    ) {
      console.log("Uploading content...");
      saveContent.mutate(data); // Only save if there is content
    } else {
      console.error("No content to save.");
      setError("Please fill in all required fields.");
    }
  };
  console.log(userDetails);
  useEffect(() => {
    if (!userDetails?.name) {
      navigate("/login");
    }
  }, [userDetails]);

  return (
    <div className="min-h-screen p-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="absolute top-[100px] left-[2%]   w-[95%] border-b text-xl outline-none"
        placeholder="Enter Title"
      />
      <select
        className="mt-20 md:mt-24 md:ml-7 cursor-pointer outline-none"
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

      {/* editor area  */}
      <div className="p-4 mt-4 bg-gray-50">
        <NewEditor
          data={data}
          onChange={setData}
          editorBlock="editorjs-container"
        />
        {error && <p className="text-red-500 ml-2 md:ml-7">{error}</p>}

        <button
          onClick={handleSave}
          className="p-2  top-[12%]  right-2  bg-green-500 rounded w-full md:w-[100px] text-white font-bold"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default NewCreate;
