import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  open: boolean;
}

const HomePage = (props: HomePageProps) => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Task Management",
      description:
        "Easily create, assign, and track tasks to ensure that your team stays on schedule and meets deadlines.",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor project progress with visual dashboards and reports to identify bottlenecks and make informed decisions.",
    },
    {
      title: "Resource Allocation",
      description:
        "Allocate resources effectively to optimize team performance and project outcomes.",
    },
  ];

  return (
    <Box className={`${styles.mainContent} ${props.open ? styles.open : ""}`}>
      <Typography variant="h2" className={styles.mainHeader}>
        Home
      </Typography>
      <Typography variant="body1" className={styles.description}>
        Welcome to the page! This powerful Project Management tool allows you to
        check in with your stakeholders, view tasks and assign tasks to
        resources. You can easily track progress, set deadlines and ensure that
        everyone is aligned on project goals. Collaborate seamlessly with your
        team, share updates and manage workloads effectively to drive project
        success.
      </Typography>
      <Typography variant="h4" className={styles.overviewHeader}>
        Overview
      </Typography>
      <Grid container spacing={3} className={styles.mainContainerGrid}>
        {cardData.map((card, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={index}
            component="div"
            className={styles.mainCardGrid}
          >
            <Card className={styles.mainCard}>
              <CardContent className={styles.mainCardContent}>
                <Typography variant="h5" className={styles.mainCardTitle}>
                  {card.title}
                </Typography>
                <Typography variant="body2">{card.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box className={styles.mainButtonContainer}>
        <Button
          variant="outlined"
          className={styles.mainButton}
          onClick={() => navigate("/projects")}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
