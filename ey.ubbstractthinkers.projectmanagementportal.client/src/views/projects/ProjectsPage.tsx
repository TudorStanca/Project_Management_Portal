import { Box, Typography } from "@mui/material";
import styles from "./ProjectsPage.module.css";
import { getProjects } from "../../services/ApiFunctions";
import { useEffect, useState } from "react";

interface ProjectsPageProps {
  open: boolean;
}

const ProjectsPage = (props: ProjectsPageProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProjects().then((data) => {
      //TO DO: Use data, add loading stage and do error messages
      setData(data);
    });
  }, []);

  return (
    <Box
      className={`${styles.projectsContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h1" className={styles.projectsHeader}>
        Projects
      </Typography>
    </Box>
  );
};

export default ProjectsPage;
