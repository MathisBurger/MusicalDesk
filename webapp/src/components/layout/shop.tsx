import { CurrentUserContext } from "@/hooks/useCurrentUser";
import { Container, CssBaseline, CssVarsProvider } from "@mui/joy";
import { PropsWithChildren } from "react";
import ShopHeader from "../shop/header";
import useTheme from "@/hooks/useTheme";
import { User } from "@/types/api/user";
import TranslationWrapper from "../wrapper/translation-wrapper";

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
        <TranslationWrapper>
          <ShopHeader />
          <Container>{children}</Container>
        </TranslationWrapper>
      </CurrentUserContext.Provider>
    </CssVarsProvider>
  );
};

export default ShopLayout;
