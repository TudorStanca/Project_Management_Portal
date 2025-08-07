import { Box } from "@mui/material";
import backgroundDecor1 from "../../../assets/background-decor1.svg";
import backgroundDecor2 from "../../../assets/background-decor2.svg";
import backgroundDecor3 from "../../../assets/background-decor3.svg";
import backgroundDecor4 from "../../../assets/background-decor4.svg";
import backgroundDecor5 from "../../../assets/background-decor5.svg";
import backgroundDecor6 from "../../../assets/background-decor6.svg";
import styles from "./AuthBackground.module.css";

const AuthBackground = () => {
  return (
    <>
      <Box
        component="img"
        src={backgroundDecor1}
        alt="background-decor1"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDecor2}
        alt="background-decor2"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDecor3}
        alt="background-decor3"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDecor4}
        alt="background-decor4"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDecor5}
        alt="background-decor5"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDecor6}
        alt="background-decor6"
        className={styles.backgroundImage}
      />
    </>
  );
};

export default AuthBackground;
