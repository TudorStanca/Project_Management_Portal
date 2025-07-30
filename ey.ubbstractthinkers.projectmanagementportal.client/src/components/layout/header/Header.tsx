import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import styles from "./Header.module.css";
import logo from "../../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar className={styles.headerAppbar}>
      <Toolbar className={styles.headerToolbar}>
        <Box className={styles.headerBox}>
          <IconButton
            size="small"
            edge="start"
            className={styles.headerIconButton}
            onClick={() => navigate("/")}
          >
            <Box component="img" src={logo} alt="Logo" />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            className={styles.headerTypography}
          >
            Project Management Portal
          </Typography>
        </Box>

        <Button variant="outlined" className={styles.headerButton}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
