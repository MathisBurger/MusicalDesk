"use client";
import LayoutAuthWrapper from "@/components/wrapper/layout-auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";

import enMessages from "../../translations/en.json";
import deMessages from "../../translations/de.json";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (navigator.language || "en").split("-")[0];

  const messages = useMemo(() => {
    switch (locale) {
      case "de":
        return deMessages;
      default:
        return enMessages;
    }
  }, [locale]);
  const [queryClient] = useState(() => new QueryClient());

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated)
    return (
      <html lang="de">
        <body>
          <p>Hydrating</p>
        </body>
      </html>
    );

  return (
    <html lang="de">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryClientProvider client={queryClient}>
            <LayoutAuthWrapper>{children}</LayoutAuthWrapper>
          </QueryClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
