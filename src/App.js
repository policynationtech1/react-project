import React, { useState } from "react";
import {BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";


function App() {
  const [formData, setFormData] = useState({});

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <BrowserRouter>
    <nav>
      <Link to="/home">Home</Link> | {' '}
    </nav>
    <Routes>
      <Route path="/" element={<Home update={updateData} />} />
      <Route path="/home" element={<Home update={updateData} />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;