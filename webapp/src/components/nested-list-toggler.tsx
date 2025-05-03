import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import React, {
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

const Toggler = ({
  renderToggle,
  children,
}: {
  children: ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": {
              overflow: "hidden",
            },
          },
          open ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
};

const NestedListToggler = ({
  children,
  title,
  icon,
}: PropsWithChildren<{ title: string; icon: ReactNode }>) => (
  <Toggler
    renderToggle={({ open, setOpen }) => (
      <ListItemButton onClick={() => setOpen(!open)}>
        {icon}
        <ListItemContent>
          <Typography level="title-sm">{title}</Typography>
        </ListItemContent>
        <KeyboardArrowDown
          sx={[
            open
              ? {
                  transform: "rotate(180deg)",
                }
              : {
                  transform: "none",
                },
          ]}
        />
      </ListItemButton>
    )}
  >
    <List sx={{ gap: 0.5 }}>{children}</List>
  </Toggler>
);

export default NestedListToggler;
