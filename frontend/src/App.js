// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Intro from "./pages/Intro";          // Your intro page
import Home from "./pages/Home";      // Your existing Home component
import { templateMap } from "./components/TemplateSelector";

// Dynamic Portfolio Page Component
const PortfolioPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/users/${id}`);
        if (!res.ok) throw new Error("User not found");
        const userData = await res.json();
        setData(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        setData(null);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (!data) {
    return <div className="p-8 text-center">Loading portfolio...</div>;
  }

  const TemplateComponent = templateMap[data.template];

  if (!TemplateComponent) {
    return (
      <div className="p-8 text-center">
        <p>Template not found. Using default.</p>
        <p>Got: <strong>{data.template}</strong></p>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading template...</div>}>
      <TemplateComponent data={data} />
    </React.Suspense>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Routes>
          {/* 👉 Intro loads at root */}
          <Route path="/" element={<Intro />} />

          {/* 👉 Add route for Home */}
          <Route path="/home" element={<Home />} />
          <Route path="/Home" element={<Home />} /> {/* Optional: case-insensitive support */}

          {/* 👉 Dynamic portfolio route */}
          <Route path="/portfolio/:id" element={<PortfolioPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;