import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Box, Toolbar } from "@mui/material";
import Header from "./components/layout/header/Header";
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";
import HomePage from "./pages/home/HomePage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProjectsPage from "./pages/projects/ProjectsPage";
import AddProjectPage from "./pages/projects/AddProjectPage";
import ProjectPage from "./pages/projects/projectPage/ProjectPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProjectStakeholdersPage from "./pages/projects/projectPage/ProjectStakeholdersPage";
import ProjectResourcesPage from "./pages/projects/projectPage/ProjectResourcesPage";
import ProjectTasksPage from "./pages/projects/projectPage/ProjectTasksPage";
import AddTemplatePage from "./pages/templates/AddTemplatePage";

function App() {
  const [open, setOpen] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.8 },
    );

    const currentFooterRef = footerRef.current;

    if (currentFooterRef) {
      observer.observe(currentFooterRef);
    }

    return () => {
      if (currentFooterRef) {
        observer.unobserve(currentFooterRef);
      }
    };
  }, []);

  return (
    <Box className="home-box">
      <BrowserRouter>
        {<Header />}
        <Toolbar />
        <Navbar
          open={open}
          setOpen={(bool: boolean) => setOpen(bool)}
          footerVisible={footerVisible}
        />
        <Routes>
          <Route path="/" element={<HomePage open={open} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects" element={<ProjectsPage open={open} />} />
          <Route
            path="/add-template"
            element={<AddTemplatePage open={open} />}
          />
          <Route path="/add-project" element={<AddProjectPage open={open} />} />
          <Route
            path="/projects/:projectId"
            element={<ProjectPage open={open} />}
          />
          <Route
            path="/projects/:projectId/stakeholders"
            element={<ProjectStakeholdersPage open={open} />}
          />
          <Route
            path="/projects/:projectId/resources"
            element={<ProjectResourcesPage open={open} />}
          />
          <Route
            path="/projects/:projectId/tasks"
            element={<ProjectTasksPage open={open} />}
          />
        </Routes>
        <Footer ref={footerRef} />
      </BrowserRouter>
    </Box>
  );
}

export default App;
