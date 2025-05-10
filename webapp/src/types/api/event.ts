// EVENT

export interface EventRequest {
  name: string | null;
  price: number | null;
  tax_percentage: number;
  image_id: number;
  event_date: string | null;
  active_from: string | null;
  active_until: string | null;
}

export interface Event {
  id: number;
  name: string;
  price: number;
  tax_percentage: number;
  image_id: number | null;
  event_date: Date | string;
  active_from: Date | null;
  active_until: Date | null;
}

export interface ShopEvent {
  event: Event;
  tickets_left: number;
}

// TICKET

export interface CreateTicketsRequest {
  valid_until: string;
  quantity: number;
}

export interface Ticket {
  id: number;
  event_id: number;
  valid_until: Date;
  invalidated: boolean;
  invalidated_at: Date | null;
}

export interface UserTicket {
  id: number;
  event_id: number;
  event_name: string;
  event_image_id: number;
  valid_until: string;
  invalidated: boolean;
  invalidated_at: string | null;
  owner_id: number;
  bought_at: string;
}

export interface UserTicketWithQrCode extends UserTicket {
  qr_content: string;
}

// OTHER

export interface QrCodeRequest {
  qr_content: string;
}

export interface ShoppingCartRequest {
  event_id: number;
  quantity: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface PaymentCheckoutResponse {
  checkout_uri: string;
}

export interface ShoppingCartItem {
  event_id: number;
  image_id: number;
  name: string;
  min_reserved_until: Date | string;
  count: number;
  total_price: number;
}
