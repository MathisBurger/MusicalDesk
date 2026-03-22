# 🎵 MusicalDesk

[![](https://tokei.rs/b1/github/MathisBurger/MusicalDesk?category=lines)](https://github.com/XAMPPRocky/tokei)

> [!CAUTION]
> **Status: DISCONTINUED / ARCHIVED** > This project was originally developed as a hobby project to manage a public musical association at my school. However, it was never officially deployed, and since established competitors offer more mature solutions for this niche, development has been ceased. 

---

## 📌 Project Overview
MusicalDesk was designed as an all-in-one management suite for a school musical club. It aimed to bridge the gap between internal member administration and public-facing ticket sales.

The project reached a high level of functional maturity (MVP) before being archived, including a full payment flow and financial reporting.

## ✨ Features (MVP Status)

The following features were implemented and are fully functional in the codebase:

* **Membership Management:** Simple user and member administration with extended profiles (functions, names, etc.).
* **Ticket Shop:** Frontend with event details, Stripe payment integration, and QR code generation for customers.
* **Validation System:** Backend tools to scan/invalidate tickets and view their status.
* **Finance & Expenses:** Comprehensive expense management including category tagging, receipt image uploads, and annual financial reports.
* **Dashboard:** High-level overview of financial data, remaining ticket counts, and membership income.

## 🏗️ Architectural Decisions

Given the specific use case (school environment), the system was built with the following constraints:
* **Low Concurrency:** Optimized for a maximum of ~30 active users at once.
* **Monolithic Design:** No distributed systems needed for these workloads.
* **Simplified Data Handling:** Pagination was intentionally omitted in the first release to prioritize feature depth over scale.

## 🛠️ Technology Stack

* **Payment:** Stripe API
* **Translations:** i18next (Frontend)
* **Database:** PostgreSQL (with full cascade handling)

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
