export interface CreateBackendUserRequest {
  username: string;
  password: string;
  roles: UserRole[];
}

export interface UpdateBackendUserRequest {
  roles: UserRole[];
}

export interface UpdateBackendUserPasswordRequest {
  password: string;
}

export interface User {
  id: number;
  username: string;
  roles: UserRole[];
}

export enum UserRole {
  Admin = "admin",
  MemberAdmin = "member_admin",
  EventAdmin = "event_admin",
  ShopCustomer = "shop_customer",
  TicketInvalidator = "ticket_invalidator",
  Accountant = "accountant",
}
