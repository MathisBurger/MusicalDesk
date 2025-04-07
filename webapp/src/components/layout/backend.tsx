import { CurrentUserContext, User } from "@/hooks/useCurrentUser";
import { Box, CssBaseline, CssVarsProvider, Theme } from "@mui/joy";
import { PropsWithChildren } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import ContentWrapper from "../wrapper/content-wrapper";
import useTheme from "@/hooks/useTheme";

interface BackendLayoutProps {
  currentUser: User | null;
}

const BackendLayout = ({
  children,
  currentUser,
}: PropsWithChildren<BackendLayoutProps>) => {
  const theme = useTheme();

  return (
    <CssVarsProvider disableTransitionOnChange theme={theme}>
      <CssBaseline />
      <CurrentUserContext.Provider value={currentUser}>
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar />
          <Header />
          <ContentWrapper>{children}</ContentWrapper>
        </Box>
      </CurrentUserContext.Provider>
    </CssVarsProvider>
  );
};

export default BackendLayout;
