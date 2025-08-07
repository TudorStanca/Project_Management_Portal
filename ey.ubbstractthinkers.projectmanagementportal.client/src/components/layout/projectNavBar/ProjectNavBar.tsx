import { NavLink } from "react-router-dom";
import styles from "./ProjectNavBar.module.css";

interface ProjectNavBarProps {
  projectUid: string;
  activeLink: ActiveLinkType;
}

type ActiveLinkType = "overview" | "stakeholders" | "resources" | "tasks";

const ProjectNavBar = (props: ProjectNavBarProps) => {
  const projectBaseUrl = `/projects/${props.projectUid}`;

  return (
    <div className={styles.navBarContainer}>
      <NavLink
        to={projectBaseUrl}
        className={`${styles.navBarLink} ${props.activeLink === "overview" ? styles.activeLink : ""}`}
      >
        Overview
      </NavLink>
      <NavLink
        to={`${projectBaseUrl}/stakeholders`}
        className={`${styles.navBarLink} ${props.activeLink === "stakeholders" ? styles.activeLink : ""}`}
      >
        Stakeholders
      </NavLink>
      <NavLink
        to={`${projectBaseUrl}/resources`}
        className={`${styles.navBarLink} ${props.activeLink === "resources" ? styles.activeLink : ""}`}
      >
        Resources
      </NavLink>
      <NavLink
        to={`${projectBaseUrl}/tasks`}
        className={`${styles.navBarLink} ${props.activeLink === "tasks" ? styles.activeLink : ""}`}
      >
        Tasks
      </NavLink>
    </div>
  );
};

export default ProjectNavBar;
