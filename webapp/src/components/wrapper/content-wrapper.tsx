"use client";
import { Box } from "@mui/joy";
import { PropsWithChildren } from "react";

const ContentWrapper = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        pt: { xs: "calc(12px + var(--Header-height))", md: 3 },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100dvh",
        gap: 1,
        overflow: "auto",
      }}
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: { sm: -100, md: -110 },
            bgcolor: "background.body",
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 } }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentWrapper;
