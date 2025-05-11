"use client";
import { Alert, AlertProps } from "@mui/joy";
import { ReactNode, useState } from "react";

interface ShowAlertProps {
  color: AlertProps["color"];
  variant?: AlertProps["variant"];
  content: ReactNode;
  duration?: number;
}

const useAlert = () => {
  const [alert, setAlert] = useState<ShowAlertProps | null>(null);

  const showAlert = (props: ShowAlertProps) => {
    setAlert(props);

    if (props.duration) {
      setTimeout(() => setAlert(null), props.duration);
    }
  };

  const displayAlert = () => {
    if (alert === null) {
      return null;
    }
    return (
      <Alert color={alert.color} variant={alert.variant ?? "soft"}>
        {alert.content}
      </Alert>
    );
  };

  return { showAlert, displayAlert };
};

export default useAlert;
