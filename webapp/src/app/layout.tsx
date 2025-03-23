"use client";
import AuthWrapper from "@/components/wrapper/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

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
