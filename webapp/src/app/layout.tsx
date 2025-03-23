"use client";
import AuthWrapper from "@/components/wrapper/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
