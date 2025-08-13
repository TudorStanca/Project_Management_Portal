import {
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Navbar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthFunction";

interface NavbarProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
  footerVisible: boolean;
}

const Navbar = (props: NavbarProps) => {
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  const drawerWidth = "240px";
  const headerHeight = "64px";
  const footerHeight = "64px";
  const drawerHeight = `calc(100vh - ${headerHeight} - ${
    props.footerVisible ? footerHeight : "0px"
  })`;

  const navbarOptions = [
    { text: "Home", path: "/" },
    { text: "Projects", path: "/projects" },
    { text: "Templates", path: "/add-template" },
    { text: "Approvals", path: "/approvals" },
  ];

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <>
      {!props.open && (
        <IconButton
          onClick={() => props.setOpen(true)}
          className={styles.navbarBurgerButton}
        >
          <MenuIcon className={styles.navbarMenuIcon} />
        </IconButton>
      )}
      <Drawer
        variant="persistent"
        anchor="left"
        open={props.open}
        sx={{
          "& .MuiDrawer-paper": {
            top: headerHeight,
            maxHeight: drawerHeight,
            transition: "max-height 0.1 ease-in-out",
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <div className={styles.navbarDrawerHeader}>
          <IconButton
            onClick={() => props.setOpen(false)}
            className={styles.navbarDrawerButton}
          >
            <CloseIcon className={styles.navbarMenuIcon} />
          </IconButton>
        </div>
        <List>
          {navbarOptions.map(({ text, path }) => (
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? `${styles.activeLink}` : ""
              }
              key={text}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                }
              }}
            >
              <Tooltip
                title={
                  !isAuthenticated ? "Authenticate to use this feature" : ""
                }
                arrow
                disableHoverListener={isAuthenticated}
              >
                <ListItem key={text} disablePadding>
                  <ListItemButton disabled={!isAuthenticated}>
                    <ListItemText
                      className={styles.navbarListItemText}
                      primary={text}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </NavLink>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
