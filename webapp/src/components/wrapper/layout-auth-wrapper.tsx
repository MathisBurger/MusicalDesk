"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/hooks/useCurrentUser";
import useUserSelfQuery from "@/hooks/queries/useUserSelfQuery";
import LoadingComponent from "../loading";
import BackendLayout from "../layout/backend";
import ShopLayout from "../layout/shop";

const LayoutAuthWrapper = ({ children }: PropsWithChildren<unknown>) => {
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
      } else if (
        pathname.startsWith("/backend") ||
        pathname.startsWith("/shop/my-")
      ) {
        router.push("/login");
      }
    }
  }, [data, isLoading, isFetched, pathname, router]);

  // Define layout for backend
  if (pathname.startsWith("/backend")) {
    if (currentUser !== null) {
      return (
        <BackendLayout currentUser={currentUser}>{children}</BackendLayout>
      );
    }
    return <LoadingComponent />;
  }

  // Define shop layout
  return <ShopLayout currentUser={currentUser}>{children}</ShopLayout>;
};

export default LayoutAuthWrapper;
