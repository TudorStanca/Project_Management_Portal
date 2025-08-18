import { Box, Typography } from "@mui/material";
import styles from "./BoxContent.module.css";

interface BoxContentProps {
  isOpen: boolean;
  pageName: string;
  children: React.ReactNode;
  className?: string;
}

const BoxContent = (props: BoxContentProps) => {
  return (
    <Box
      className={`${styles.boxContentBox} ${props.isOpen ? styles.open : ""} ${props.className ? props.className : ""}`}
    >
      <Typography
        variant="h2"
        className={`${styles.boxContentHeader} ${props.className}`}
      >
        {props.pageName}
      </Typography>
      {props.children}
    </Box>
  );
};

export default BoxContent;
