import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectPage.module.css";
import { useEffect, useState, type FormEvent } from "react";
import { getProject } from "../../services/ProjectClient";
import type { Project } from "../../models/Project";

interface ProjectPageProps {
  open: boolean;
}

const ProjectPage = (props: ProjectPageProps) => {
  const [project, setProject] = useState<Project>({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { projectId } = useParams();

  useEffect(() => {
    setIsLoading(true);

    const fetchProject = async () => {
      try {
        const fetchedProject = await getProject(projectId!);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return (
    <Box
      className={`${styles.projectContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.projectHeader}>
        Project
      </Typography>
    </Box>
  );
};

export default ProjectPage;
