import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

interface NotFoundPageProps {
  open: boolean;
}

const NotFoundPage = (props: NotFoundPageProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box className={`${styles.boxContentBox} ${props.open ? styles.open : ""}`}>
      <Typography
        variant="h1"
        component="h1"
        sx={{ fontSize: "5rem", marginBottom: "20px" }}
      >
        404
      </Typography>
      <Typography variant="h5" component="h2" sx={{ marginBottom: "20px" }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
