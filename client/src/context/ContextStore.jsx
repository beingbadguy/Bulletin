import { createContext, useState, useEffect } from "react";

export const ContextStore = createContext();

const MyContext = ({ children }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [tempmail, setTempMail] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  // Retrieve and parse user data from localStorage
  const [userDetails, setUserDetails] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  return (
    <ContextStore.Provider
      value={{
        serverUrl,
        tempmail,
        setTempMail,
        isAuth,
        setIsAuth,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </ContextStore.Provider>
  );
};

export default MyContext;
