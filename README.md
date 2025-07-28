# MusicalDesk

[![](https://tokei.rs/b1/github/MathisBurger/MusicalDesk?category=lines)](https://github.com/XAMPPRocky/tokei)

MVP Planning:

- [x] Simple membership management
- [x] Shop frontend with event details
- [x] Navigate user back to page he visited before if it is a shop event uri
- [x] Stripe payment integration & ticket buy process
- [x] Add cron scheduler that permanently revokes expired sessions
- [x] Return to old checkout session button
- [x] Frontend success and cancel pages
- [x] Option for customer to view his ticket orders & QR Code generation
- [x] Remove invalidated field from tickets. invalidated_at is enough
- [x] Create backend users & user overview that are not customers
- [x] Add option to frontend to invalidate tickets and see their status
- [x] Expense management (With categories, Images of bills, etc.)
- [x] Annual finance reports
- [ ] Expense dashboard
- [ ] Generalize images to files and make special endpoint for uploading files for events
- [x] Move all frontend API types into typings folder
- [ ] Eliminate all warnings
- [ ] Backend code documentation
- [ ] Extend user information (firstName, lastName, function, etc.)
- [ ] Add useful dashboard (financial data, latest events and how many tickets left, member count and total yearly income through memberships)
- [ ] Add frontend translations
- [ ] Make translation language configurable in user settings
- [ ] Handle cascade in database
- [ ] GitHub issues marked with MVP
- [ ] Add good README file


## Application architecture decisions

- Low amount of total users and active users at the same time
- Maximum of 30 active users at the same time
- No need for distributed system at these minor workloads
- Pagination is not needed. And if needed, it will be implemented in an later release.
