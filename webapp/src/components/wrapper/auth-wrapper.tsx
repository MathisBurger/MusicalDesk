"use client";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import { PropsWithChildren } from "react";
import Sidebar from "../sidebar";
import { usePathname } from "next/navigation";

const AuthWrapper = ({ children }: PropsWithChildren<unknown>) => {
  const pathname = usePathname();

  if (pathname.startsWith("/backend")) {
    return (
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar />
          {children}
        </Box>
      </CssVarsProvider>
    );
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
};

export default AuthWrapper;
