export interface CreateBackendUserRequest {
  username: string;
  password: string;
  roles: UserRole[];
  first_name: string;
  surname: string;
  function: string;
  language: Language;
}

export interface UpdateBackendUserRequest {
  roles: UserRole[];
  first_name: string;
  surname: string;
  function: string;
  language: Language;
}

export interface UpdateBackendUserPasswordRequest {
  password: string;
}

export enum Language {
  English = "en",
  German = "de",
}

export interface User {
  id: number;
  username: string;
  roles: UserRole[];
  first_name: string;
  surname: string;
  function: string;
  language: Language;
}

export enum UserRole {
  Admin = "admin",
  MemberAdmin = "member_admin",
  EventAdmin = "event_admin",
  ShopCustomer = "shop_customer",
  TicketInvalidator = "ticket_invalidator",
  Accountant = "accountant",
  ExpenseRequestor = "expense_requestor",
}
