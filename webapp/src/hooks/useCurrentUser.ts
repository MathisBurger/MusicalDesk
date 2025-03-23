import { createContext, useContext } from "react";

export interface User {
  id: number;
}

export const CurrentUserContext = createContext<User | null>(null);

const useCurrentUser = () => useContext(CurrentUserContext);

export default useCurrentUser;
