import type { User } from "@models/Auth";
import Avatar from "@mui/material/Avatar";
import LetterAvatar from "../../components/avatar/LetterAvatar";
import styles from "./RenderAvatar.module.css";

interface RenderAvatarProps {
  value: User;
}

const RenderAvatar = (props: RenderAvatarProps) => {
  return (
    <div className={styles.RenderAvatarDiv}>
      {props.value.photo ? (
        <Avatar
          alt={props.value.firstName + " " + props.value.lastName}
          src={`user.photo instanceof Blob ? URL.createObjectURL(user.photo) : undefined`}
        />
      ) : (
        <LetterAvatar
          firstName={props.value.firstName ? props.value.firstName : ""}
          lastName={props.value.lastName ? props.value.lastName : ""}
        />
      )}
    </div>
  );
};

export default RenderAvatar;
