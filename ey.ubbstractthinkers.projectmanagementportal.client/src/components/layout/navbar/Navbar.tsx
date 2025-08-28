import {
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  Tooltip,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Navbar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthFunction";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import ApprovalIcon from "@mui/icons-material/Approval";
import AddIcon from "@mui/icons-material/Add";
import { isAuthPage } from "../../../utils/LocationFunctions";

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
    {
      text: "Home",
      path: "/",
      icon: <HomeIcon className={styles.navbarListItemIcon} />,
    },
    {
      text: "Projects",
      path: "/projects",
      icon: <AssignmentIcon className={styles.navbarListItemIcon} />,
    },
    {
      text: "Add Project",
      path: "/add-project",
      icon: <AddIcon className={styles.navbarListItemIcon} />,
    },
    {
      text: "Templates",
      path: "/templates",
      icon: <ClassIcon className={styles.navbarListItemIcon} />,
    },
    {
      text: "Approvals",
      path: "/approvals",
      icon: <ApprovalIcon className={styles.navbarListItemIcon} />,
    },
  ];

  if (isAuthPage(location)) {
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
        className={styles.navbarContainer}
        sx={{
          "& .MuiDrawer-paper": {
            top: headerHeight,
            maxHeight: drawerHeight,
            transition: "max-height 0.1 ease-in-out",
            width: drawerWidth,
            boxSizing: "border-box",
            background:
              "linear-gradient(270deg, var(--color-bg) 0%, #141637 100%)",
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
          {navbarOptions.map(({ text, path, icon }) => (
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
                <ListItem
                  key={text}
                  disablePadding
                  className={styles.navbarListItem}
                >
                  <ListItemButton
                    disabled={!isAuthenticated}
                    className={styles.navbarListItemButton}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
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
