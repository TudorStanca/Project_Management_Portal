import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Box } from "@mui/material";
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
import ApprovalsPage from "./pages/approvals/ApprovalsPage";
import ProtectedRoute from "./components/context/auth/ProtectedRoute";
import TemplatesPage from "./pages/templates/TemplatesPage";
import TemplatePage from "./pages/templates/TemplatePage";
import UserProfilePage from "./pages/auth/UserProfilePage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import CustomToolbar from "./components/layout/background/CustomToolbar";

function App() {
  const [open, setOpen] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.7 },
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
        <Header />
        <CustomToolbar />
        <Navbar
          open={open}
          setOpen={(bool: boolean) => setOpen(bool)}
          footerVisible={footerVisible}
        />
        <Routes>
          <Route path="/" element={<HomePage open={open} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates/:templateId"
            element={
              <ProtectedRoute>
                <TemplatePage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <TemplatesPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-template"
            element={
              <ProtectedRoute>
                <TemplatePage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-project"
            element={
              <ProtectedRoute>
                <AddProjectPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId/stakeholders"
            element={
              <ProtectedRoute>
                <ProjectStakeholdersPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId/resources"
            element={
              <ProtectedRoute>
                <ProjectResourcesPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId/tasks"
            element={
              <ProtectedRoute>
                <ProjectTasksPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute>
                <ApprovalsPage open={open} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage open={open} />} />
        </Routes>
        <Footer ref={footerRef} />
      </BrowserRouter>
    </Box>
  );
}

export default App;
