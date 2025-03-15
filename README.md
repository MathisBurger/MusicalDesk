# MusicalDesk


## Application architecture decisions

- Low amount of total users and active users at the same time
- Maximum of 30 active users at the same time
- No need for distributed system at these minor workloads
- Pagination is not needed. And if needed, it will be implemented in an later release.
