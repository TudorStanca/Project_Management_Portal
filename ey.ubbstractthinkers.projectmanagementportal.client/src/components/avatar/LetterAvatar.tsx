import { Avatar } from "@mui/material";
import React from "react";

interface LetterAvatarProps {
  firstName: string;
  lastName: string;
}

const LetterAvatar = (props: LetterAvatarProps) => {
  //source code : https://mui.com/material-ui/react-avatar/
  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const getAvatarProps = (name: string) => {
    const nameParts = name.split(" ");
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts.length > 1 ? nameParts[1][0] : "";

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${firstInitial}${lastInitial}`,
    };
  };

  return <Avatar {...getAvatarProps(props.firstName + " " + props.lastName)} />;
};

export default LetterAvatar;
