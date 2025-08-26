import { Box, Link, Stack, Typography } from "@mui/material";
import styles from "./Footer.module.css";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { forwardRef, type Ref } from "react";
import { useLocation } from "react-router-dom";
import { isAuthPage } from "../../../utils/LocationFunctions";

const Footer = forwardRef((_, ref: Ref<HTMLDivElement>) => {
  const location = useLocation();

  if (isAuthPage(location)) {
    return null;
  }

  return (
    <Box component="footer" ref={ref} className={styles.footerBox}>
      <Stack direction="row" spacing={3} className={styles.footerStack}>
        <Typography variant="body2">
          <CopyrightIcon />
          {new Date().getFullYear()}
          EY
        </Typography>
        <Link href="#" underline="hover">
          Terms Of Service
        </Link>
        <Link href="#" underline="hover">
          FAQ
        </Link>
      </Stack>
    </Box>
  );
});

export default Footer;
