"use client";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/hooks/useCurrentUser";
import useUserSelfQuery from "@/hooks/queries/useUserSelfQuery";
import LoadingComponent from "../loading";
import Header from "../header";

const AuthWrapper = ({ children }: PropsWithChildren<unknown>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isSuccess } = useUserSelfQuery(
    pathname.startsWith("/backend"),
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      // Forward to login page on unauthorized access
      if (data === null && pathname.startsWith("/backend")) {
        router.push("/login");
      }
      if (data !== null) {
        setCurrentUser(data ?? null);
      }
    }
  }, [data, isLoading, isSuccess, pathname, router]);

  if (pathname.startsWith("/backend")) {
    if (currentUser !== null) {
      return (
        <CssVarsProvider disableTransitionOnChange>
          <CssBaseline />
          <Box sx={{ display: "flex", minHeight: "100dvh" }}>
            <Sidebar />
            <Header />
            {children}
          </Box>
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
