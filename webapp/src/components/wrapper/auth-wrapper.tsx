"use client";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { usePathname, useRouter } from "next/navigation";
import { CurrentUserContext, User } from "@/hooks/useCurrentUser";
import useUserSelfQuery from "@/hooks/queries/useUserSelfQuery";
import LoadingComponent from "../loading";
import Header from "../header";
import ContentWrapper from "./content-wrapper";

const AuthWrapper = ({ children }: PropsWithChildren<unknown>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isFetched } = useUserSelfQuery(
    pathname.startsWith("/backend"),
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
        <CssVarsProvider disableTransitionOnChange>
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
      {children}
    </CssVarsProvider>
  );
};

export default AuthWrapper;
