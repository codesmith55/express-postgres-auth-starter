import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import SecretView from './routes/secret';
import Login from './routes/login';
import Signup from './routes/signup';


import {AuthService} from "@genezio/auth";
import ResetPasswordForm from "./routes/reset.tsx";

const authToken = import.meta.env.VITE_AUTH_TOKEN;
const region = import.meta.env.VITE_REGION;

console.log("region", region);
AuthService.getInstance().setTokenAndRegion(authToken, region);

const router = createBrowserRouter([
    {
        path: "/",
        element: <SecretView/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/signup",
        element: <Signup/>,
    },
    {
        path: "/reset",
        element: <ResetPasswordForm/>,
    }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
