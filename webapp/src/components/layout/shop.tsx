import { CurrentUserContext, User } from "@/hooks/useCurrentUser";
import { Container, CssBaseline, CssVarsProvider, Theme } from "@mui/joy";
import { PropsWithChildren } from "react";
import ShopHeader from "../shop/header";
import useTheme from "@/hooks/useTheme";

interface ShopLayoutProps {
  currentUser: User | null;
}

const ShopLayout = ({
  children,
  currentUser,
}: PropsWithChildren<ShopLayoutProps>) => {
  const theme = useTheme();

  return (
    <CssVarsProvider disableTransitionOnChange theme={theme}>
      <CssBaseline />
      <CurrentUserContext.Provider value={currentUser}>
        <ShopHeader />
        <Container>{children}</Container>
      </CurrentUserContext.Provider>
    </CssVarsProvider>
  );
};

export default ShopLayout;
