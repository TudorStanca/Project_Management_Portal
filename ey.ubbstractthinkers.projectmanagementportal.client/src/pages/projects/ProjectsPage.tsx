import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import styles from "./ProjectsPage.module.css";
import { getProjectsForUser } from "@services/ProjectClient";
import { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Project } from "@models/Project";
import { type User } from "@models/Auth";
import { getUser } from "@services/AuthClient";
import { handleApiError } from "@services/ErrorHandler";
import BoxContent from "../../components/layout/background/BoxContent";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";
import { truncateDescription } from "../../utils/StringFunctions";
import { formatDayjsToString } from "../../utils/DateFunctions";

interface ProjectsPageProps {
  open: boolean;
}

const ProjectsPage = (props: ProjectsPageProps) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const navigate = useNavigate();

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchUserWithProjects = async () => {
      try {
        const user: User = await getUser();
        const projects = await getProjectsForUser(user.id ?? "");

        setProjects(projects);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserWithProjects();
  }, []);

  return (
    <BoxContent isOpen={props.open} pageName="Projects">
      {isLoading ? (
        <Box className={styles.projectsMessageBox}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Box className={styles.projectsMessageBox}>
          <Typography variant="h4" className={styles.projectsMessageTypography}>
            No projects to show
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          size={{ xs: 12, sm: 6, md: 3 }}
          spacing={3}
          className={styles.projectsList}
        >
          {projects.map((project) => (
            <div className={styles.projectsCardWrapper} key={project.uid}>
              <div className={styles.projectsCardGlowWrapper}>
                <Card
                  className={styles.projectsCard}
                  onClick={() => navigate(`/projects/${project.uid}`)}
                >
                  <CardContent className={styles.projectsCardContent}>
                    <Typography
                      variant="h5"
                      className={styles.projectsCardHeader}
                    >
                      {project.name}
                    </Typography>
                    <hr className={styles.projectsCardBreakLine} />
                    <Box className={styles.projectsCardBoxContent}>
                      <Typography
                        variant="body2"
                        className={styles.projectsCardTypography}
                      >
                        {`Start Date: ${formatDayjsToString(project.startDate)}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={styles.projectsCardTypography}
                      >
                        About:{" "}
                        {project.description && project.description.length > 0
                          ? truncateDescription(project.description) + "..."
                          : "Nothing to show"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </Grid>
      )}
      <Button
        variant="outlined"
        startIcon={<AddCircleOutline className={styles.projectsAddIcon} />}
        className={styles.projectsAddButton}
        onClick={() => navigate("/add-project")}
      >
        Add
      </Button>

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </BoxContent>
  );
};

export default ProjectsPage;
