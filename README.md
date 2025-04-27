# Quantum Stash

**WORK IN PROGRESS**

Quantum Stash is an open-source Software as a Service (SaaS) web application designed for efficient inventory management.

Tailored for e-commerce companies, it is versatile enough to meet the needs of any business requiring meticulous stock control. Explore the power of Quantum Stash to streamline your operations, providing a comprehensive solution for overseeing your stock and optimizing business processes.

The project serves as my portfolio demo piece, showcasing my skills in developing full-stack applications involving advanced features and techniques, such as:

- Modern, intuitive user interface
- Appropriate server- and client-side rendering
- Advanced authentication, including:
  - JWT and HTTP-Only Cookies
  - Authentication with OAuth Google and GitHub providers
  - Authentication with email and password
  - Email verification functionality
  - Password reset and update functionality
- Transactional emails with Resend and React Email
- Serverless PostgreSQL database conenction
- Complex ralations between database models
- Prepared statements for fast SQL execution
- Client- and server-side form validation with Zod
- Server actions
- Relevant CRUD operations
- Stripe payments integration
- Robust type checking and full type safety

You can check the deployed demo version [TODO: here]()

<br />

![public/images/screenshots/screenshot_1](./public/images/screenshots/screenshot_1.png)

![public/images/screenshots/screenshot_2](./public/images/screenshots/screenshot_2.png)

<br />

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org)
- **Authentication:** [Next-Auth 5](https://next-auth.js.org/)
- **Database:** [Postgres (Neon)](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Forms:** [React Hook Form](https://react-hook-form.com)
- **Email:** [React Email](https://react.email) and [Resend](https://resend.com)
- **Validations:** [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Hosting:** [Vercel](https://vercel.com)

<br />

## ToDo

- [ ] User interface (UI)
- [ ] Implement authentication and authorization
- [ ] Use new SignIn and SignOut methods in place of the ones from v. 4
- [ ] Fix the avatar after OAuth SignIn not being visible
- [ ] Fix the toast messaging after correct Sign In
- [ ] Unable or gracefully handle sign in with the same email, using Google and GitHub (OAuthAccountNotLinkedError)
- [ ] Refactor server actions
- [ ] Set up database connection and ORM
- [ ] Define data schemas
- [ ] Implement missing forms
- [ ] Implement User, Organizations, Notifications, and Quick Help menu pages
- [ ] Implement Other Apps menu
- [ ] Connect Stripe and define plans
- [ ] Make SaaS subscriptions functional
- [ ] Make the dashboard use dynamic data
- [ ] Set up and implement email notifications
- [ ] User profile management
- [ ] Database connection with Neon's PostgreSQL and DrizzleORM
- [ ] Transactional emails with Resend and React Email
- [ ] Collapse any open collapsibles in the sidebar nav when collapsing the sidebar itself (use global state management)
- [ ] Improve responsiveness
- [ ] Fix the QuickCreate menu
- [ ] Fix the gaps in Settings
- [ ] Add skeleton loading states for all pages
- [ ] Extend prepared statements with create, update and delete

# Product Status Documentation

This document provides information about the product status values used in the database.

## Product Status Enum

The product status enum (`ProductStatus`) defines the possible states for a product in the system. It's defined in the database schema and can be imported from `@/db/schema`.

```typescript
export const productStatus = pgEnum("ProductStatus", ["DRAFT", "ACTIVE", "ARCHIVED", "PUBLISHED"]);
```

### Status Values

- **DRAFT**: Products that are still being worked on and are not ready for public viewing or purchase. This is the default status for newly created products.
- **ACTIVE**: Products that are ready to be shown to customers but might not be promoted or featured.
- **PUBLISHED**: Products that are fully available for browsing and purchase, and may be featured in catalogs or promotions.
- **ARCHIVED**: Products that are no longer available for purchase but are kept in the system for record-keeping purposes.

### Usage in code

The ProductStatusEnum can be imported and used in your application:

```typescript
import { ProductStatusEnum, ProductStatusType } from "@/db/schema";

// Use as a type
const status: ProductStatusType = ProductStatusEnum.PUBLISHED;

// Check status
if (product.status === ProductStatusEnum.ACTIVE) {
  // Do something with active products
}
```

## Database Schema Definition

The product status is defined as a field in the products table:

```typescript
export const products = pgTable(
  "products",
  {
    // Other fields...
    status: productStatus().default("DRAFT").notNull(),
    // Other fields...
  },
  // Table configurations...
);
```

By default, new products are created with the "DRAFT" status.
