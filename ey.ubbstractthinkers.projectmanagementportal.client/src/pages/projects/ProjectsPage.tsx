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
import { getProjectsForUser } from "../../services/ProjectClient";
import { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../models/Project";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { User } from "../../models/Auth";
import { getUser } from "../../services/AuthClient";

interface ProjectsPageProps {
  open: boolean;
}

const ProjectsPage = (props: ProjectsPageProps) => {
  const [user, setUser] = useState<User>({
    id: null,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    photo: new Blob(),
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchUserWithProjects = async () => {
      try {
        const user: User = await getUser();
        setUser(user);
        const projects = await getProjectsForUser(user.id ?? "");
        setProjects(projects);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserWithProjects();
  }, [user.id]);

  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    let truncated = "";

    for (const word of words) {
      if ((truncated + word).length <= 100) {
        truncated += word + " ";

        if (word.endsWith(".")) break;
      }
    }
    return truncated.trim();
  };

  const formatFriendlyDate = (isoDate: string | Dayjs) => {
    let date: Date;

    if (dayjs.isDayjs(isoDate)) {
      date = isoDate.toDate();
    } else {
      date = new Date(isoDate);
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box
      className={`${styles.projectsContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.projectsHeader}>
        Projects
      </Typography>
      {isLoading ? (
        <Box className={styles.projectsMessageBox}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Box className={styles.projectsMessageBox}>
          <Typography variant="h3" className={styles.projectsMessageTypography}>
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
                        {`Start Date: ${formatFriendlyDate(project.startDate)}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={styles.projectsCardTypography}
                      >
                        About:{" "}
                        {project.description && project.description.length > 0
                          ? truncateDescription(project.description)
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
    </Box>
  );
};

export default ProjectsPage;
