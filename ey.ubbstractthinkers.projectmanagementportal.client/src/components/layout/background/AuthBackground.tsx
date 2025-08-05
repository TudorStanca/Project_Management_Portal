import { Box } from "@mui/material";
import backgroundDetail1 from "../../../assets/background-detail1.svg";
import backgroundDetail2 from "../../../assets/background-detail2.svg";
import backgroundDetail3 from "../../../assets/background-detail3.svg";
import backgroundDetail4 from "../../../assets/background-detail4.svg";
import backgroundDetail5 from "../../../assets/background-detail5.svg";
import backgroundDetail6 from "../../../assets/background-detail6.svg";
import styles from "./AuthBackground.module.css";

const AuthBackground = () => {
  return (
    <>
      <Box
        component="img"
        src={backgroundDetail1}
        alt="background-detail1"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDetail2}
        alt="background-detail2"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDetail3}
        alt="background-detail3"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDetail4}
        alt="background-detail4"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDetail5}
        alt="background-detail5"
        className={styles.backgroundImage}
      />
      <Box
        component="img"
        src={backgroundDetail6}
        alt="background-detail6"
        className={styles.backgroundImage}
      />
    </>
  );
};

export default AuthBackground;
