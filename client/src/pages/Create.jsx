import React, { useEffect } from "react";
import Editor from "../components/Editor";

const Create = () => {
  const { serverUrl, userDetails } = useContext(ContextStore);
  // console.log(userDetails);

  useEffect(() => {
    if (!userDetails) {
      navigate("/login");
    }
  }, [userDetails]);
  return (
    <div>
      <Editor />
    </div>
  );
};

export default Create;
