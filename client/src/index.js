import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Login"
import Create from './components/Create'
import Home from './components/Home.js'
import Register from './components/Register'
import Logout from "./components/Logout"
import Board from "./components/Board"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
