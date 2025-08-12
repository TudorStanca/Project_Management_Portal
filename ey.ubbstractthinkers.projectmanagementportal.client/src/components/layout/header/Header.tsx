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
import { getUser, logout } from "@services/AuthClient";
import { DefaultUser, type User } from "@models/Auth";
import LetterAvatar from "../../avatar/LetterAvatar";

const Header = () => {
  const [user, setUser] = useState<User>(DefaultUser);
  const photoUrl =
    user.photo instanceof Blob ? URL.createObjectURL(user.photo) : undefined;

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
      navigate("/");
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
            <div className={styles.headerAvatarDiv} onClick={handleMenuClick}>
              {user.photo ? (
                <Avatar
                  alt={user.firstName + " " + user.lastName}
                  src={photoUrl}
                />
              ) : (
                <LetterAvatar
                  firstName={user.firstName ?? ""}
                  lastName={user.lastName ?? ""}
                />
              )}
            </div>
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
