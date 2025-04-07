"use client";
import { Box, CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";
import { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { usePathname, useRouter } from "next/navigation";
import { CurrentUserContext, User } from "@/hooks/useCurrentUser";
import useUserSelfQuery from "@/hooks/queries/useUserSelfQuery";
import LoadingComponent from "../loading";
import Header from "../header";
import ContentWrapper from "./content-wrapper";

const theme = extendTheme({
  components: {
    JoyModal: {
      styleOverrides: {
        root: {
          zIndex: 9999,
        },
      },
    },
    JoySelect: {
      styleOverrides: {
        listbox: {
          zIndex: 9997,
        },
      },
    },
  },
});

const AuthWrapper = ({ children }: PropsWithChildren<unknown>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isFetched } = useUserSelfQuery(
    !pathname.startsWith("/login") || pathname.startsWith("/register"),
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoading && isFetched) {
      if (data) {
        setCurrentUser(data);
      } else if (pathname.startsWith("/backend")) {
        router.push("/login");
      }
    }
  }, [data, isLoading, isFetched, pathname, router]);

  if (pathname.startsWith("/backend")) {
    if (currentUser !== null) {
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
    }
    return <LoadingComponent />;
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <CurrentUserContext.Provider value={currentUser}>
        {children}
      </CurrentUserContext.Provider>
    </CssVarsProvider>
  );
};

export default AuthWrapper;
