import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import MyContext from "./context/ContextStore.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerificationPage from "./pages/VerificationPage.jsx";
import User from "./pages/User.jsx";
import Forget from "./pages/Forget.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import PasswordChangeConfirmPage from "./pages/PasswordChangeConfirmPage.jsx";
import Article from "./pages/Article.jsx";
import Stories from "./pages/Stories.jsx";
import SingleArticle from "./pages/SingleArticle.jsx";
import Newsletter from "./pages/Newsletter.jsx";
import Create from "./pages/Create.jsx";
import Error from "./pages/Error.jsx";
import NewCreate from "./pages/NewCreate.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/articles",
        element: <Article />,
      },
      {
        path: "/stories",
        element: <Stories />,
      },
      {
        path: "articles/:id",
        element: <SingleArticle />,
      },
      {
        path: "newsletter",
        element: <Newsletter />,
      },
      {
        path: "write",
        element: <NewCreate />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "verify",
        element: <VerificationPage />,
      },
      {
        path: "forget",
        element: <Forget />,
      },
      {
        path: "reset-password/:token",
        element: <ForgetPassword />,
      },
      {
        path: "success",
        element: <PasswordChangeConfirmPage />,
      },
      // {
      //   path: "new",
      //   element: <NewCreate />,
      // },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MyContext>
        <RouterProvider router={router} />
      </MyContext>
    </QueryClientProvider>
  </StrictMode>
);
