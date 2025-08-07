import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectStakeholdersPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";

interface ProjectStakeholdersPageProps {
  open: boolean;
}

const ProjectStakeholdersPage = (props: ProjectStakeholdersPageProps) => {
  const { projectId } = useParams();

  return (
    <Box
      className={`${styles.projectStakeholdersContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.projectStakeholdersHeader}>
        Stakeholders
      </Typography>
      <ProjectNavBar projectUid={projectId!} activeLink="stakeholders" />
    </Box>
  );
};

export default ProjectStakeholdersPage;
