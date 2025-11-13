// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Creators from "./Creators";
import Signup from "./Signup";
import Mypages from "./app/Mypages";         
import RequireAuth from "./routes/RequireAuth"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/me" element={<RequireAuth> <Mypages /> </RequireAuth>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
