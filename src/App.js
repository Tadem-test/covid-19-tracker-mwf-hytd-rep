import React from "react";
import { HashRouter, Route, Routes , Redirect } from "react-router-dom";

// components
import Layout from "./components/Layout/Layout";

export default function App() {
  return (
    <HashRouter>
      <Routes >
      <Route path='/' element={<Layout/>} />
      </Routes >
    </HashRouter>
  );
}
