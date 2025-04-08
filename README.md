# MusicalDesk

Features:

- [x] Simple membership management
- [x] Shop frontend with event details
- [x] Navigate user back to page he visited before if it is a shop event uri
- [x] Stripe payment integration & ticket buy process
- [x] Add cron scheduler that permanently revokes expired sessions
- [x] Return to old checkout session button
- [x] Frontend success and cancel pages
- [ ] Option for customer to view his ticket orders & QR Code generation
- [ ] Set reference in ticket in which payment it has been bought
- [ ] Option to add tickets to your google / apple wallet
- [ ] Create backend users & user overview that are not customers
- [ ] Add option to frontend to invalidate tickets and see their status
- [ ] Backend code documentation
- [ ] Expense management (With categories, Images of bills, etc.)
- [ ] Annual finance reports
- [ ] Transfer tickets to other users


## Application architecture decisions

- Low amount of total users and active users at the same time
- Maximum of 30 active users at the same time
- No need for distributed system at these minor workloads
- Pagination is not needed. And if needed, it will be implemented in an later release.
