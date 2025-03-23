"use client";
import { Box, CircularProgress, CssBaseline, CssVarsProvider } from "@mui/joy";

const LoadingComponent = () => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100dvh",
          width: "100%",
        }}
      >
        <CircularProgress variant="soft" />
      </Box>
    </CssVarsProvider>
  );
};

export default LoadingComponent;
