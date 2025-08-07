import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectResourcesPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";

interface ProjectResourcesPageProps {
  open: boolean;
}

const ProjectResourcesPage = (props: ProjectResourcesPageProps) => {
  const { projectId } = useParams();

  return (
    <Box
      className={`${styles.resourcesResourcesContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.resourcesResourcesHeader}>
        Resources
      </Typography>
      <ProjectNavBar projectUid={projectId!} activeLink="resources" />
    </Box>
  );
};

export default ProjectResourcesPage;
