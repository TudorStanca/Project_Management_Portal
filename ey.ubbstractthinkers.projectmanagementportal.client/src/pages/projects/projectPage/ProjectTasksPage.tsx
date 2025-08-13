import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectTasksPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import StageStepper from "../../../components/stepper/StageStepper";

interface ProjectTasksPageProps {
  open: boolean;
}

const ProjectTasksPage = (props: ProjectTasksPageProps) => {
  const { projectId } = useParams();

  return (
    <Box
      className={`${styles.projectTasksContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.projectTasksHeader}>
        Tasks
      </Typography>
      <ProjectNavBar projectUid={projectId!} activeLink="tasks"></ProjectNavBar>
    </Box>
  );
};

export default ProjectTasksPage;
