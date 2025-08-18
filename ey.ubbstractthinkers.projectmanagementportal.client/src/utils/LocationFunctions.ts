import { type Location } from "react-router-dom";

export function isAuthPage(location: Location) {
  return location.pathname === "/login" || location.pathname === "/register";
}
