# Inventory Management Application

Full-stack web application for creating and managing customizable inventories and items.

Users can:
* create inventories, 
* define custom fields, 
* add items, 
* share access with other users, 
* comment on inventories, and like items.

---

# Live Demo

Frontend:
`https://inventory-app-client-alpha.vercel.app`

Backend API:
`https://inventory-app-t1u6.onrender.com`

Repository:
`https://github.com/DianaKurt/inventory-app.git`

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack React Query
* Material UI
* i18next (internationalization)

## Backend

* Node.js
* Express
* Prisma ORM

## Database

* PostgreSQL

---

# Application Architecture

The frontend is organized using a modular layered structure inspired by **feature-oriented architecture..**

```
client/src
├ app
│  ├ layout
│  ├ providers
│  ├ routes
│  └ styles
├ entities
│  ├ inventory
│  ├ item
│  ├ field
│  ├ tag
│  └ user
├ pages
│  ├ admin
│  ├ auth
│  ├ home
│  ├ inventories
│  ├ inventory
│  ├ item
│  ├ search
│  └ user
├ shared
│  ├ api
│  ├ lib
│  ├ types
│  └ ui
└ main.tsx
```

Backend structure:

```
server
 ├ routes
 ├ services
 ├ middleware
 ├ prisma
 └ app.ts
```

---

# Core Features

## Inventories

Users can create inventories containing items.

Each inventory includes:

* title
* category
* description
* visibility (public/private)
* owner

Inventories can be searched and filtered.

---

## Custom Fields

Inventories support **dynamic custom fields.**

Supported field types:

* TEXT_SINGLE
* TEXT_MULTI
* NUMBER
* LINK
* BOOLEAN

Field limits per inventory:

```
3 fields per type
```

Fields can be reordered.

---

## Items

Items belong to inventories.

Each item contains:

* custom ID
* dynamic field values
* timestamps
* creator

Custom IDs can be:

* manually defined
* automatically generated

Example:

```
INV-0001-493012
```

---

## Likes

Users can like items.

The database uses a **compound key**:

```
(itemId, userId)
```

Features:

* toggle like
* like counter
* user-specific state

Endpoint:

```
GET  /api/items/:id/likes
POST /api/items/:id/likes/toggle
```

---

## Discussion

Each inventory includes a discussion section.

Users can:

* post messages
* view comments
* see timestamps and authors

---

## Access Control

Inventories support access management.

Inventories can be:

### Public

Anyone can view the inventory.

### Private

Only selected users can access it.

Permissions stored in:

```
InventoryAccess
```

Users may have **read or write access.**

---

## Admin Panel

Admin users can:

* block/unblock users
* promote users to admin
* delete users

---

# API Overview

Main endpoints:

```
GET    /api/inventories
POST   /api/inventories
PATCH  /api/inventories/:id
DELETE /api/inventories/:id

GET    /api/items
POST   /api/items
PATCH  /api/items/:id
DELETE /api/items/:id

GET    /api/items/:id/likes
POST   /api/items/:id/likes/toggle
```

---

# Test Data

The application includes demo data for easier testing.

Example inventories:

* Books Collection
* Movie Library
* Travel Gear
* Programming Notes

Each inventory contains several items and comments.

---

# Test Accounts

Admin:

```
email: d@local
password: 123456
```

User:

```
email: kola@local
password: 123456
```


---

# Running Locally

## Backend

```
cd server
npm install
npx prisma migrate dev
npm run dev
```

## Frontend

```
cd client
npm install
npm run dev
```

---

# Database

Database schema managed with Prisma ORM.

Main models:

* User
* Inventory
* Item
* Field
* ItemFieldValue
* InventoryAccess
* Like
* Post
* Tag

---

# Testing

Manual testing scenarios were performed for the main workflows:

1. User registration and login
2. Creating inventories
3. Adding custom fields
4. Creating items
5. Editing item values
6. Liking items
7. Posting discussion messages
8. Access control for private inventories

---

# Known Limitations

The following features are partially implemented or planned:
* automated test suite
* advanced search filters
* item activity statistics
* image uploads for inventories
* notification system
* some modules still use local UI state before full backend integration
* automated tests are not implemented yet
* some shared components exist but are not used everywhere
* advanced analytics is simplified
* image upload UI exists but is not fully integrated

---
# Demo Scenario

The following scenario demonstrates the core functionality of the application.
It can be used by reviewers to quickly test the system.

---

## 1. Login as Admin

Use the admin test account:

```text
email: admin@test.com
password: admin123
```

After login you will see the **Dashboard page**.

---

## 2. Create a New Inventory

Navigate to:

```text
Inventories → Create Inventory
```

Fill the form:

* Title: `Books Collection`
* Category: `Book`
* Description: `Personal book archive`

Click **Create**.

You will be redirected to the **Inventory Page**.

---

## 3. Add Custom Fields

Open the **Fields tab**.

Create several fields:

| Field Type  | Title         |
| ----------- | ------------- |
| TEXT_SINGLE | Author        |
| NUMBER      | Pages         |
| LINK        | Purchase Link |
| BOOLEAN     | Read          |

Fields will appear in the inventory structure and will be used by items.

---

## 4. Create an Item

Go to the **Items tab**.

Click **Create Item**.

Example values:

| Field         | Value               |
| ------------- | ------------------- |
| Author        | George Orwell       |
| Pages         | 328                 |
| Purchase Link | https://example.com |
| Read          | true                |

Save the item.

You will see the item with an automatically generated ID such as:

```text
INV-0001-482193
```

---

## 5. Like an Item

Open the created item.

Press the **Like button** in the engagement section.

Expected result:

* Like counter increases
* Button changes to **Unlike**

---

## 6. Add Discussion Message

Open the **Discussion tab** in the inventory.

Write a comment such as:

```text
Great inventory for organizing books.
```

Submit the post.

The comment will appear in the discussion feed.

---

## 7. Share Inventory with Another User

Open the **Access tab**.

Add a user:

```text
user@test.com
```

Grant access.

The second user will now see the inventory in their workspace.

---

## 8. Login as Another User

Login with:

```text
email: user@test.com
password: user123
```

Navigate to **My Workspace**.

The shared inventory should now appear.

The user can:

* view items
* like items
* participate in discussion
---
# Architecture Highlights

This project was designed with a modular architecture to improve scalability and maintainability.

## Modular Frontend Structure

## Feature-based Frontend Structure
The frontend separates responsibilities into layers:

app      → global configuration
entities → domain models
pages    → application screens
shared   → reusable modules

The frontend follows a **feature-oriented structure** instead of a purely component-based one.
This makes it easier to scale the project as new modules are added.

Example:

```text
entities/
  admin/
  field/
  inventory/
  item/
  tag/
  user/
pages/
  admin/
  auth/
  home/
  inventories/
  inventory/
  item/
  search/
  user/
shared/
  api/
  lib/
  types/
  ui/
```

Domain-related code is grouped by entities, while pages assemble complete screens from reusable modules.

---

## Backend Service Layer

The backend separates logic into **routes and services**.

Routes only handle:

* request validation
* routing

Business logic is implemented in **services**.

Example:

```text
routes/
  inventories.ts
  items.ts

services/
  inventory.service.ts
  item.service.ts
  access.service.ts
```

This keeps controllers lightweight and improves testability.

---

## Optimistic Concurrency Control

Inventories and items use a **version field** to prevent update conflicts.

When updating a resource:

1. Client sends the current version.
2. Server checks if the version matches.
3. If versions differ, a `409 Conflict` is returned.

This prevents accidental overwrites when multiple users edit the same data.

---
# Application Screenshots

## Home Page

![Home](screenshots/home.png)

## Inventory Page

![Inventory](screenshots/inventory.png)

## Item Page

![Item](screenshots/item.png)

## Admin Panel

![Admin](screenshots/admin.png)

<p align="center">
  <img src="screenshots/home.png" width="800">
</p>
---
# Author


Diana Suchkova

Full-stack inventory management system developed as a practical project.
