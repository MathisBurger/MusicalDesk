import useCurrentUser from "@/hooks/useCurrentUser";
import { PropsWithChildren, useMemo } from "react";

import enMessages from "../../../translations/en.json";
import deMessages from "../../../translations/de.json";
import { Language } from "@/types/api/user";
import { NextIntlClientProvider } from "next-intl";

const TranslationWrapper = ({ children }: PropsWithChildren) => {
  const user = useCurrentUser();

  const messages = useMemo(() => {
    switch (user?.language) {
      case Language.German:
        return deMessages;
      default:
        return enMessages;
    }
  }, [user?.language]);

  return (
    <NextIntlClientProvider locale={user?.language || "de"} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default TranslationWrapper;
