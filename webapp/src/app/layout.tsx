"use client";
import AuthWrapper from "@/components/wrapper/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <QueryClientProvider client={queryClient}>
          <AuthWrapper>{children}</AuthWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}
