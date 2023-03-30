import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Login"
import Create from './components/Create'
import Home from './components/Home.js'
import Register from './components/Register'
import Logout from "./components/Logout"
import Board from "./components/Board"
import Post from "./components/Post"
import Classes from "./components/Classes"
import CreateClass from "./components/CreateClass"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ClassList, {
  loader as classListLoader,
} from "./components/ClassList"
const router = createBrowserRouter([
  {
    path: "/",
    children:[
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />
      },
      {
        path: "board",
        element: <Board />
      },
      {
        path: "post",
        element: <Post />,
        path: "classes",
        element: <Classes />
      },
      {
        path: "create-class",
        element: <CreateClass />
      },
      {
        path: "classlist/:classID",
        element: <ClassList />,
        loader: classListLoader,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
