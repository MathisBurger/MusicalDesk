"use client";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import { PropsWithChildren } from "react";
import Sidebar from "../sidebar";

const AuthWrapper = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar />
        {children}
      </Box>
    </CssVarsProvider>
  );
};

export default AuthWrapper;
