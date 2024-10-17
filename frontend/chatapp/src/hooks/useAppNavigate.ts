import { useNavigate } from "react-router-dom";
import AppRoute from "../enums/AppRoute";

export default function useAppNavigate() {
  const navigate = useNavigate();

  return (route: AppRoute) => {
    navigate(route);
  };
}
