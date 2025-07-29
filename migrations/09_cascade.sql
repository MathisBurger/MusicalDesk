alter table public.membership_paid
drop constraint membership_paid_member_id_fkey;

alter table public.membership_paid add foreign key (member_id) references public.members on delete cascade;

alter table public.expense_reports_transactions
drop constraint expense_reports_transactions_report_id_fkey;

alter table public.expense_reports_transactions add foreign key (report_id) references public.expense_reports on delete cascade;

alter table public.expense_reports_transactions
drop constraint expense_reports_transactions_transaction_id_fkey;

alter table public.expense_reports_transactions add foreign key (transaction_id) references public.expense_transactions on delete cascade;

alter table public.expense_reports_category_sumup
drop constraint expense_reports_category_sumup_report_id_fkey;

alter table public.expense_reports_category_sumup add foreign key (report_id) references public.expense_reports on delete cascade;

alter table public.expense_reports_category_sumup
drop constraint expense_reports_category_sumup_category_id_fkey;

alter table public.expense_reports_category_sumup add foreign key (category_id) references public.expense_categories on delete set null;

alter table public.shopping_cart_items
drop constraint shopping_cart_items_user_id_fkey;

alter table public.shopping_cart_items add foreign key (user_id) references public.users on delete cascade;

alter table public.shopping_cart_items
drop constraint shopping_cart_items_ticket_id_fkey;

alter table public.shopping_cart_items add foreign key (ticket_id) references public.tickets on delete cascade;

alter table public.checked_out_tickets
drop constraint checked_out_tickets_ticket_id_fkey;

alter table public.checked_out_tickets add foreign key (ticket_id) references public.tickets on delete cascade;

alter table public.expense_images
drop constraint expense_images_expense_id_fkey;

alter table public.expense_images add foreign key (expense_id) references public.expense_expenses on delete cascade;

alter table public.expense_images
drop constraint expense_images_image_id_fkey;

alter table public.expense_images add foreign key (image_id) references public.images on update cascade;

alter table public.expense_join_expense_budget
drop constraint expense_join_expense_budget_budget_id_fkey;

alter table public.expense_join_expense_budget add foreign key (budget_id) references public.expense_budgets on delete cascade;

alter table public.expense_join_expense_budget
drop constraint expense_join_expense_budget_expense_id_fkey;

alter table public.expense_join_expense_budget add foreign key (expense_id) references public.expense_expenses on update cascade;

alter table public.expense_budgets
drop constraint expense_budgets_category_id_fkey;

alter table public.expense_budgets add foreign key (category_id) references public.expense_categories on delete cascade;

alter table public.expense_expenses
drop constraint expenses_expense_transaction_id_fkey;

alter table public.expense_expenses add constraint expenses_expense_transaction_id_fkey foreign key (expense_transaction_id) references public.expense_transactions on delete restrict;

alter table public.expense_expenses
drop constraint expenses_balancing_transaction_id_fkey;

alter table public.expense_expenses add constraint expenses_balancing_transaction_id_fkey foreign key (balancing_transaction_id) references public.expense_transactions on delete restrict;

alter table public.expense_expenses
drop constraint expense_expenses_requestor_id_fkey;

alter table public.expense_expenses add foreign key (requestor_id) references public.users on delete set null;

alter table public.image_access
drop constraint image_access_image_id_fkey;

alter table public.image_access add foreign key (image_id) references public.images on delete cascade;

alter table public.image_access
drop constraint image_access_user_id_fkey;

alter table public.image_access add foreign key (user_id) references public.users on update cascade;

alter table public.events
drop constraint events_image_id_fkey;

alter table public.events add foreign key (image_id) references public.images on delete set null;

alter table public.expense_transactions
drop constraint expense_transactions_from_account_id_fkey;

alter table public.expense_transactions add foreign key (from_account_id) references public.expense_accounts on delete restrict;

alter table public.expense_transactions
drop constraint expense_transactions_to_account_id_fkey;

alter table public.expense_transactions add foreign key (to_account_id) references public.expense_accounts on delete restrict;

alter table public.expense_transactions
drop constraint expense_transactions_category_id_fkey;

alter table public.expense_transactions add foreign key (category_id) references public.expense_categories on delete restrict;

alter table public.tickets
drop constraint tickets_event_id_fkey;

alter table public.tickets add foreign key (event_id) references public.events on delete cascade;

alter table public.tickets
drop constraint tickets_owner_id_fkey;

alter table public.tickets add foreign key (owner_id) references public.users on delete set null;
