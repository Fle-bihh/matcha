import { Container } from "@/container/index.container";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NavigationSetup({ container }: { container: Container }) {
  const navigate = useNavigate();

  useEffect(() => {
    container.setNavigate((path, options) => {
      navigate(path, options);
    });
  }, [navigate, container]);

  return null;
}
