import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  MenuItem,
  Menu,
} from "@mui/material";
import styles from "./Header.module.css";
import logo from "../../../assets/logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthFunction";
import { getUser, logout } from "../../../services/AuthClient";
import type { User } from "../../../models/Auth";

const Header = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    photo: new Blob(),
  });
  const photoUrl =
    user.photo instanceof Blob ? URL.createObjectURL(user.photo) : undefined;
  const displayName = `${user.firstName || "User"} ${
    user.lastName || ""
  }`.trim();

  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, handleLogout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      handleLogout();
      handleMenuClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        const user: User = await getUser();
        setUser(user);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

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

        {isAuthenticated ? (
          <>
            {user.photo ? (
              <Avatar
                alt={user.firstName + " " + user.lastName}
                src={photoUrl}
                onClick={handleMenuClick}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Avatar
                {...stringAvatar(displayName)}
                onClick={handleMenuClick}
                style={{ cursor: "pointer" }}
              />
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleMenuClose();
                }}
              >
                User Profile
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box className={styles.headerBoxButtons}>
            <Button
              variant="outlined"
              className={styles.headerButton}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              className={styles.headerButton}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
