"use client";
import { User } from "@/types/api/user";
import { createContext, useContext } from "react";

export const CurrentUserContext = createContext<User | null>(null);

const useCurrentUser = () => useContext(CurrentUserContext);

export default useCurrentUser;
