// MEMBER

export interface CreateMemberRequest {
  first_name: string;
  last_name: string;
  email: string | null;
  street: string | null;
  house_nr: string | null;
  zip: string | null;
  city: string | null;
  iban: string | null;
  membership_fee: number | null;
}

export interface EditMemberRequest {
  first_name: string;
  last_name: string;
  email: string | null;
  street: string | null;
  house_nr: string | null;
  zip: string | null;
  city: string | null;
  iban: string | null;
  membership_fee: number | null;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  street: string | null;
  house_nr: string | null;
  zip: string | null;
  city: string | null;
  iban: string | null;
  membership_fee: number | null;
  joined_at: string;
  left_at: number | null;
}

// MEMBERSHIP

export interface CreateMemberPaymentRequest {
  year: number;
  member_id: number;
  paid_at: string;
}

export interface MembershipPaid {
  year: number;
  member_id: number;
  paid_at: string;
}
