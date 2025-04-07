import { createContext, useContext } from "react";

export enum UserRole {
  Admin = "admin",
  MemberAdmin = "memeber_admin",
  EventAdmin = "event_admin",
  ShopCustomer = "shop_customer",
}

export interface User {
  id: number;
  username: string;
  roles: UserRole[];
}

export const CurrentUserContext = createContext<User | null>(null);

const useCurrentUser = () => useContext(CurrentUserContext);

export default useCurrentUser;
