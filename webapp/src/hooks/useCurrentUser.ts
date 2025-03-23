import { createContext, useContext } from "react";

export enum UserRole {
  Admin = "admin",
}

export interface User {
  id: number;
  username: string;
  roles: UserRole[];
}

export const CurrentUserContext = createContext<User | null>(null);

const useCurrentUser = () => useContext(CurrentUserContext);

export default useCurrentUser;
