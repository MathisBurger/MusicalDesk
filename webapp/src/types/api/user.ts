export interface CreateBackendUserRequest {
  username: string;
  password: string;
  roles: UserRole[];
  first_name: string;
  surname: string;
  function: string;
}

export interface UpdateBackendUserRequest {
  roles: UserRole[];
  first_name: string;
  surname: string;
  function: string;
}

export interface UpdateBackendUserPasswordRequest {
  password: string;
}

export interface User {
  id: number;
  username: string;
  roles: UserRole[];
  first_name: string;
  surname: string;
  function: string;
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
