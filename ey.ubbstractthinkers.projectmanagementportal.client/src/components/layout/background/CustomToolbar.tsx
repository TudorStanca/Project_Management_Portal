import { Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { isAuthPage } from "../../../utils/LocationFunctions";

const CustomToolbar = () => {
  const location = useLocation();

  if (isAuthPage(location)) {
    return null;
  }

  return <Toolbar />;
};

export default CustomToolbar;
