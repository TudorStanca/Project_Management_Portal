import type { User } from "@models/Auth";
import Avatar from "@mui/material/Avatar";
import LetterAvatar from "./LetterAvatar";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
  user: User;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  imageClassName?: string;
}

const UserAvatar = (props: UserAvatarProps) => {
  return (
    <div
      className={`${styles.userAvatarDiv} ${props.className ? props.className : ""}`}
      onClick={props.onClick ? props.onClick : undefined}
    >
      {props.user.profileImage ? (
        <Avatar
          className={props.imageClassName ?? ""}
          alt={props.user.firstName + " " + props.user.lastName}
          src={props.user.profileImage}
        />
      ) : (
        <LetterAvatar
          className={props.imageClassName ?? ""}
          firstName={props.user.firstName ?? ""}
          lastName={props.user.lastName ?? ""}
        />
      )}
    </div>
  );
};

export default UserAvatar;
