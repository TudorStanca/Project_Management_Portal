import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Box, Toolbar } from "@mui/material";
import Header from "./components/layout/header/Header";
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";
import HomePage from "./views/home/HomePage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProjectsPage from "./views/projects/ProjectsPage";

function App() {
  const [open, setOpen] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <Box className="home-box">
      <BrowserRouter>
        <Header />
        <Toolbar />
        <Navbar open={open} setOpen={setOpen} footerVisible={footerVisible} />
        <Routes>
          <Route path="/" element={<HomePage open={open} />} />
          <Route path="/projects" element={<ProjectsPage open={open} />} />
        </Routes>
        <Footer ref={footerRef} />
      </BrowserRouter>
    </Box>
  );
}

export default App;
