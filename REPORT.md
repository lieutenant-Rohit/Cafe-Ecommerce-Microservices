# BloomCafeV2 — Full Project Analysis Report

> Generated: Wed Aug 26 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Backend Microservices](#3-backend-microservices)
4. [Frontend](#4-frontend)
5. [Data Flow](#5-data-flow)
6. [Infrastructure](#6-infrastructure)
7. [Security](#7-security)
8. [Issues & Recommendations](#8-issues--recommendations)

---

## 1. Project Overview

BloomCafeV2 is a full-stack cafe ordering platform built with a microservices backend and a React SPA frontend.

| Attribute | Value |
|---|---|
| Backend | Java 21, Spring Boot 4.x, Maven |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Database | PostgreSQL 16 (5 databases) |
| Messaging | Apache Kafka 7.6 |
| Caching | Redis 7 |
| Orchestration | Docker Compose |
| Total backend Java files | 97 |
| Total frontend source files | 57 (.ts + .tsx) |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (Vite)                       │
│              React 18 · TypeScript · Tailwind                │
│                    localhost:3000 (dev)                      │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP (via Vite proxy / gateway)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   gateway-service (:8080)                    │
│              Spring Cloud Gateway · Actuator                 │
└──────┬──────────┬──────────┬──────────┬──────────┬───────────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
  ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
  │  user   ││ catalog ││  cart   ││  order  ││inventory│
  │ :8081   ││ :8082   ││ :8083   ││ :8084   ││ :8085   │
  │  (DB)   ││ DB+Redis││ DB+Kafka││ DB+Kafka││  (DB)   │
  └─────────┘└─────────┘└────┬────┘└────┬────┘└─────────┘
                             │          │
              ┌──────────────┘          │
              │ REST (batch)            │ REST (cart, catalog, inventory)
              ▼                         ▼
         ┌─────────┐            ┌──────────────┐
         │ catalog │            │ order-service│──► Kafka "order-created"
         └─────────┘            └──────────────┘          │
                                                    ┌─────┴──────┐
                                                    ▼            ▼
                                              ┌──────────┐ ┌────────────┐
                                              │   cart   │ │notification│
                                              │ (clear)  │ │(WebSocket) │
                                              └──────────┘ └────────────┘
```

### Communication Patterns

| Pattern | Where | Details |
|---|---|---|
| Synchronous REST | order → cart, catalog, inventory | `RestClient` with JWT propagation |
| Synchronous REST | cart → catalog | Product validation + batch fetch |
| Asynchronous Kafka | order → cart, notification | `order-created` topic |
| WebSocket/STOMP | notification → client | `/topic/orders/{userId}` |
| HTTP proxy | frontend → all services | Vite dev proxy / gateway |

---

## 3. Backend Microservices

### 3.1 user-service (:8081)

| Attribute | Detail |
|---|---|
| Database | `blooms_user` (PostgreSQL) |
| Java files | 19 |
| Spring Boot | 4.1.1 |
| Key dependencies | Spring Security, JPA, Validation, jjwt 0.12.6 |

**Entities:** `User` (id, name, email, password, address, role, createdAt), `Role` enum (CUSTOMER, ADMIN, STAFF)

**Endpoints:**
- `POST /api/auth/register` — public
- `POST /api/auth/login` — public, returns JWT
- `GET /api/users/me` — ROLE_CUSTOMER
- `GET /api/users` — ROLE_ADMIN
- `GET /api/users/{id}` — ROLE_ADMIN
- `DELETE /api/users/{id}` — ROLE_ADMIN

**Security:** BCrypt password encoding, JWT with claims (userId, role, email), 1-hour token expiry.

---

### 3.2 catalog-service (:8082)

| Attribute | Detail |
|---|---|
| Database | `blooms_catalog` (PostgreSQL) + Redis |
| Java files | 17 |
| Spring Boot | 4.1.0 |
| Key dependencies | Spring Data JPA, Redis, Security, jjwt 0.12.6 |

**Entities:** `Product` (id, name, price, stockQuantity, imageUrl, category), `Category` (id, name, products)

**Endpoints:**
- `GET /api/products` — paginated, JOIN FETCH category
- `GET /api/products/category/{categoryId}` — paginated by category
- `GET /api/products/{id}` — single product
- `GET /api/products/batch?ids=1,2,3` — batch fetch (used by cart-service)
- `GET/POST/PUT/DELETE /api/categories` — CRUD

**Caching:** Redis with 10-minute TTL. `@Cacheable` on reads, `@CacheEvict` on writes. Cache keys: `"products"`, `"product"`.

---

### 3.3 cart-service (:8083)

| Attribute | Detail |
|---|---|
| Database | `blooms_cart` (PostgreSQL) |
| Java files | 19 |
| Spring Boot | 4.1.1 |
| Key dependencies | Spring Data JPA, Kafka, Security, jjwt 0.12.6 |

**Entities:** `Cart` (id, userId, items), `CartItem` (id, cart, productId, quantity)

**Endpoints:**
- `POST /api/carts` — create cart
- `GET /api/carts` — get current user's cart (enriched with product data)
- `GET /api/carts/user/{userId}` — get cart by user ID (enriched)
- `POST /api/carts/items` — add item
- `PUT /api/carts/items/{productId}` — update quantity
- `DELETE /api/carts/items/{productId}` — remove item
- `DELETE /api/carts/items` — clear cart

**Enrichment:** Returns `CartResponse` with embedded `ProductResponse` data (fetched via batch call to catalog-service). Single batch request replaces N individual product lookups.

**Kafka consumer:** Listens to `order-created` topic → clears user's cart after order placement.

---

### 3.4 order-service (:8084)

| Attribute | Detail |
|---|---|
| Database | `blooms_order` (PostgreSQL) |
| Java files | 23 |
| Spring Boot | 4.1.1 |
| Key dependencies | Spring Data JPA, Kafka, Security, jjwt 0.12.6 |

**Entities:** `Order` (id, userId, status, createdAt, items), `OrderItem` (id, order, productId, quantity, price), `OrderStatus` enum (CREATED, PAYMENT_PENDING, PAYMENT_COMPLETED, CONFIRMED, CANCELLED)

**Endpoints:**
- `GET /api/orders/checkout` — preview cart
- `POST /api/orders` — create order (orchestrates across 3 services)
- `GET /api/orders/{orderId}` — get order
- `GET /api/orders` — get user's orders
- `GET /api/orders/all` — get all orders (admin)
- `PATCH /api/orders/{orderId}/status` — update status
- `DELETE /api/orders/{orderId}` — delete order

**Order creation flow (saga orchestration):**
1. Fetch cart from cart-service
2. For each item: fetch price from catalog-service, reserve stock in inventory-service
3. On failure: release all previously reserved inventory (compensating transaction)
4. Save order
5. Publish `OrderCreated` event to Kafka

**Inter-service clients:** `CartClient` (:8083), `CatalogClient` (:8082), `InventoryClient` (:8085) — all with JWT token propagation.

**Kafka producer:** Publishes to `order-created` topic, keyed by userId.

---

### 3.5 inventory-service (:8085)

| Attribute | Detail |
|---|---|
| Database | `blooms_inventory` (PostgreSQL) |
| Java files | 10 |
| Spring Boot | 4.1.1 |
| Key dependencies | Spring Data JPA, Security, jjwt 0.12.6 |

**Entities:** `Inventory` (id, productId, availableQuantity, reservedQuantity)

**Endpoints:**
- `GET /api/inventory/{productId}` — lookup stock
- `POST /api/inventory` — create inventory record
- `POST /api/inventory/{productId}/reserve?quantity=N` — reserve stock
- `POST /api/inventory/{productId}/release?quantity=N` — release reserved stock

**Reservation pattern:** Tracks `availableQuantity` (stock for new orders) and `reservedQuantity` (held by pending orders) separately. Enables safe concurrent order processing without row locking.

---

### 3.6 notification-service (:8086)

| Attribute | Detail |
|---|---|
| Database | None (stateless) |
| Java files | 7 |
| Spring Boot | 4.1.1 |
| Key dependencies | Spring WebSocket, Kafka |

**No REST endpoints.** Purely event-driven.

**Kafka consumer:** Listens to `order-created` topic → pushes notification via WebSocket/STOMP to `/topic/orders/{userId}`.

**WebSocket config:** STOMP endpoint at `/ws` (all origins), simple broker at `/topic`.

---

### 3.7 gateway-service (:8080)

| Attribute | Detail |
|---|---|
| Database | None |
| Java files | 2 |
| Spring Boot | 4.0.8 |
| Key dependencies | Spring Cloud Gateway, Actuator |

**Routes:** Forwards to all 6 microservices based on path prefix.

**CORS:** Allows `localhost:3000` (frontend dev server).

**Note:** No Dockerfile. Not included in docker-compose.yml. Version mismatch (4.0.8 vs 4.1.x).

---

### 3.8 payment-service (EMPTY)

Placeholder directory. No source code, no pom.xml, no Dockerfile. `OrderStatus` enum already has `PAYMENT_PENDING`/`PAYMENT_COMPLETED` states anticipating this service.

---

### Backend File Counts

| Service | Java Files | Dockerfile | In docker-compose |
|---|---|---|---|
| user-service | 19 | Yes | Yes |
| catalog-service | 17 | Yes | Yes |
| cart-service | 19 | Yes | Yes |
| order-service | 23 | Yes | Yes |
| inventory-service | 10 | Yes | Yes |
| notification-service | 7 | Yes (multi-stage) | Yes |
| gateway-service | 2 | **No** | **No** |
| payment-service | 0 | No | No |
| **Total** | **97** | | |

---

## 4. Frontend

### 4.1 Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 + TypeScript 5.5 |
| Build | Vite 5.3 |
| Routing | React Router DOM 6.26 |
| State | Zustand 4.5 |
| HTTP | Axios 1.7 |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion (motion 13) |
| Icons | Lucide React |
| JWT | jwt-decode 4.0 |

### 4.2 Routing Table

| Path | Component | Layout | Auth Required |
|---|---|---|---|
| `/` | Home | None (standalone) | No |
| `/login` | Login | PublicLayout | No |
| `/register` | Register | PublicLayout | No |
| `/menu` | Menu | PublicLayout | No |
| `/cart` | Cart | PublicLayout | No |
| `/my-orders` | MyOrders | PublicLayout | No |
| `/admin` | Dashboard | AdminLayout | Admin |
| `/admin/products` | AdminProducts | AdminLayout | Admin |
| `/admin/categories` | AdminCategories | AdminLayout | Admin |
| `/admin/orders` | AdminOrders | AdminLayout | Admin |
| `/admin/users` | AdminUsers | AdminLayout | Admin |
| `/admin/inventory` | AdminInventory | AdminLayout | Admin |
| `*` | Redirect to `/` | — | — |

### 4.3 API Endpoints Used

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Authenticate, returns JWT |
| POST | `/api/auth/register` | Register new account |
| GET | `/api/users/me` | Current user profile |
| GET | `/api/users` | List all users (admin) |
| DELETE | `/api/users/{id}` | Delete user (admin) |
| GET | `/api/products` | Paginated products |
| GET | `/api/products/category/{id}` | Products by category |
| GET | `/api/products/{id}` | Single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/{id}` | Update product (admin) |
| DELETE | `/api/products/{id}` | Delete product (admin) |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/{id}` | Update category (admin) |
| DELETE | `/api/categories/{id}` | Delete category (admin) |
| POST | `/api/carts` | Create cart |
| GET | `/api/carts` | Fetch cart (enriched) |
| POST | `/api/carts/items` | Add item to cart |
| PUT | `/api/carts/items/{id}` | Update item quantity |
| DELETE | `/api/carts/items/{id}` | Remove item |
| DELETE | `/api/carts/items` | Clear cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | My orders |
| GET | `/api/orders/all` | All orders (admin) |
| GET | `/api/orders/{id}` | Single order |
| PATCH | `/api/orders/{id}/status` | Update status |
| DELETE | `/api/orders/{id}` | Delete order |
| GET | `/api/inventory/{id}` | Lookup inventory |
| POST | `/api/inventory` | Create inventory (admin) |
| POST | `/api/inventory/{id}/reserve` | Reserve stock |
| POST | `/api/inventory/{id}/release` | Release stock |

### 4.4 Auth Flow

1. User submits credentials → `POST /api/auth/login`
2. JWT returned with claims: `userId`, `role`, `email`
3. Token stored in `localStorage`; decoded via `jwt-decode`
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. 401 response → token cleared, hard redirect to `/login`
6. No token refresh mechanism — token expires after 1 hour, user is logged out silently

### 4.5 State Management

**authStore (Zustand):**
- State: `token`, `user`, `userId`, `isAuthenticated`, `isAdmin`, `isLoading`, `error`
- Actions: `login`, `register`, `logout`, `initialize`, `clearError`

**cartStore (Zustand):**
- State: `items` (CartItem[]), `cartId`, `backendReady`
- Hybrid: backend-synced when authenticated, local-only when not
- Actions: `loadFromBackend`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Derived: `totalItems()`, `totalAmount()`

### 4.6 Component Organization

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root: auth init + cart hydration
├── index.css                   # Global styles + Tailwind
├── router/index.tsx            # All routes + animations
├── store/
│   ├── authStore.ts            # Auth state (Zustand)
│   └── cartStore.ts            # Cart state (Zustand)
├── api/
│   ├── axiosClient.ts          # Axios + interceptors
│   ├── userApi.ts              # Auth + user endpoints
│   ├── productApi.ts           # Product CRUD
│   ├── categoryApi.ts          # Category CRUD
│   ├── cartApi.ts              # Cart endpoints
│   ├── orderApi.ts             # Order endpoints
│   └── inventoryApi.ts         # Inventory endpoints
├── types/index.ts              # TypeScript interfaces
├── utils/jwt.ts                # JWT decode/expiry helpers
├── hooks/useCafeStatus.ts      # Dynamic ticker content
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── Login.tsx               # Sign-in
│   ├── Register.tsx            # Registration
│   ├── Menu.tsx                # Product catalog
│   ├── Cart.tsx                # Shopping cart
│   ├── MyOrders.tsx            # Order history
│   └── admin/
│       ├── AdminLayout.tsx     # Admin shell + auth guard
│       ├── Dashboard.tsx       # Admin dashboard
│       ├── Products.tsx        # Product management
│       ├── Categories.tsx      # Category management
│       ├── Orders.tsx          # Order management
│       ├── Users.tsx           # User management
│       └── Inventory.tsx       # Inventory management
└── components/
    ├── layout/
    │   ├── Navbar.tsx          # Sticky nav
    │   ├── Footer.tsx          # Site footer
    │   ├── PublicLayout.tsx    # Navbar + Outlet + Footer
    │   └── AuthSplit.tsx       # Split-screen auth layout
    ├── ui/                     # 14 reusable UI primitives
    └── motion-primitives/      # 9 animation components
```

### 4.7 Animation & UX

- **Page transitions:** Framer Motion `AnimatePresence` with opacity + translateY
- **Scroll animations:** Intersection observer-based reveal on scroll
- **Hover effects:** Magnetic pull, border trail, spotlight, tilt, scale
- **Loading states:** Skeleton shimmer placeholders
- **Micro-interactions:** Add-to-cart feedback, shake on error, password toggle
- **Background effects:** Blob mesh, grain overlay, parallax

---

## 5. Data Flow

### Checkout Flow (Complete)

```
1. Frontend POST /api/orders
       │
2. order-service GET /api/carts/user/{userId}  ──► cart-service
       │                                             └─► GET /api/products/batch?ids=...  ──► catalog-service
       │
3. For each cart item:
   ├── GET /api/products/{id}  ──► catalog-service  (get authoritative price)
   └── POST /api/inventory/{id}/reserve?quantity=N  ──► inventory-service
       │
4. Save order to PostgreSQL
       │
5. Publish "order-created" to Kafka
       │
   ├──► cart-service: clears user's cart
   └──► notification-service: pushes WebSocket notification to client
```

### Cart Enrichment Flow

```
Frontend GET /api/carts
    │
    cart-service:
    ├── SELECT * FROM carts WHERE user_id = ?
    ├── SELECT * FROM cart_item WHERE cart_id = ?
    └── GET /api/products/batch?ids=[1,2,3]  ──► catalog-service (1 batch call)
    │
    Returns: { id, userId, items: [{ id, productId, quantity, product: {...} }] }
```

---

## 6. Infrastructure

### Docker Compose Services

| Service | Image | Port | Depends On |
|---|---|---|---|
| postgres | postgres:16 | 5432 | — |
| zookeeper | confluentinc/cp-zookeeper:7.6.0 | 2181 | — |
| redis | redis:7-alpine | 6379 | — |
| kafka | confluentinc/cp-kafka:7.6.0 | 9092 | zookeeper |
| user-service | custom build | 8081 | postgres |
| catalog-service | custom build | 8082 | postgres, redis |
| cart-service | custom build | 8083 | postgres, kafka |
| order-service | custom build | 8084 | postgres, kafka |
| inventory-service | custom build | 8085 | postgres |
| notification-service | custom build | 8086 | kafka |

**Not in docker-compose:** gateway-service, payment-service

### Database Isolation

| Service | Database |
|---|---|
| user-service | `blooms_user` |
| catalog-service | `blooms_catalog` |
| cart-service | `blooms_cart` |
| order-service | `blooms_order` |
| inventory-service | `blooms_inventory` |
| notification-service | *(none)* |

All DDL managed by Hibernate `ddl-auto=update` (no migration tool).

---

## 7. Security

### JWT Configuration

- **Library:** jjwt 0.12.6 (HMAC-SHA signing)
- **Shared secret:** `my-super-secret-key-for-blooms-cafe-user-service-2026`
- **Token expiry:** 1 hour (3,600,000 ms)
- **Claims:** `userId`, `role`, `email`
- **Storage:** `localStorage` (frontend)

### Security Rules (per service)

| Service | Public | Authenticated | Admin |
|---|---|---|---|
| user-service | `/api/auth/**` | `/api/users/me` (CUSTOMER) | `/api/users/**` |
| catalog-service | — | All | — |
| cart-service | — | All | — |
| order-service | — | All | — |
| inventory-service | — | All | — |
| notification-service | None (no security) | — | — |

### CORS

- Gateway: allows `localhost:3000`
- Notification WebSocket: allows all origins

---

## 8. Issues & Recommendations

### Critical

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 1 | **Shared JWT secret hardcoded** in all services | `application.properties` | Use environment variables; consider asymmetric signing (RSA) |
| 2 | **No token refresh** — user logged out silently on expiry | `authStore.ts` | Implement refresh token flow |
| 3 | **Gateway not in docker-compose** — no unified entry point | `docker-compose.yml` | Add gateway-service to compose |
| 4 | **Spring Boot version mismatch** across services | `pom.xml` files | Standardize to 4.1.1 |
| 5 | **Zero tests** — only default scaffold tests exist | All services | Add unit + integration tests |

### High

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 6 | **No API gateway in production** — frontend calls services directly | Frontend | Route all traffic through gateway |
| 7 | **No service discovery** — hardcoded `localhost:xxxx` URLs | `CatalogClient`, `CartClient`, etc. | Use Spring Cloud Discovery (Eureka/Consul) |
| 8 | **Duplicated JWT code** across 5 services | `JwtService.java`, `JwtAuthenticationFilter.java`, `SecurityConfig.java` | Extract to shared library module |
| 9 | **Cart not cleared on logout** | `authStore.ts` | Call `cartStore.clearCart()` in `logout()` |
| 10 | **Admin sidebar missing Inventory link** | `AdminLayout.tsx` | Add `/admin/inventory` to `navItems` |
| 11 | **Home page has no Navbar** | `router/index.tsx` | Wrap Home in PublicLayout or add Navbar |
| 12 | **`MyOrders` uses `<a>` instead of `<Link>`** | `MyOrders.tsx:70` | Use `<Link to="/menu">` for SPA navigation |

### Medium

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 13 | **Inconsistent error handling** — admin pages swallow errors silently | Admin pages | Add toast notification system |
| 14 | **Inventory page uses `alert()`** for errors | `Inventory.tsx` | Use consistent error UI |
| 15 | **No global error boundary** | `App.tsx` | Add React error boundary |
| 16 | **Demo credentials in source bundle** | `Login.tsx` | Acceptable for dev; remove before production |
| 17 | **`noUnusedLocals: false`** in tsconfig | `tsconfig.json` | Enable to catch dead code |
| 18 | **`handleSave()` in admin pages has no error handling** | `Products.tsx`, `Categories.tsx` | Add try/catch with user feedback |
| 19 | **Products page hardcodes `size=100`** | `AdminProducts.tsx` | Use configurable page size |
| 20 | **`categoryApi.fetchCategories()` defaults to size=50** | `categoryApi.ts` | Fine for now; add pagination UI if categories grow |

### Low

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 21 | **No README.md** at root or frontend | Root | Add project documentation |
| 22 | **No CI/CD pipeline** | — | Add GitHub Actions / similar |
| 23 | **No `.env` files** | — | Create `.env.example` with required variables |
| 24 | **Inconsistent Tailwind palettes** — admin uses gray, public uses cream/coffee | Admin vs public pages | Unify design system |
| 25 | **`PaginatedResponse` field names may mismatch backend** | `types/index.ts` | Verify `pageNumber`/`pageSize` match Spring Boot's `Page` serialization |
| 26 | **notification-service has no security** | `SecurityConfig` (absent) | Add WebSocket auth (JWT in handshake) |
| 27 | **Hibernate `ddl-auto=update` in production** | All `application.properties` | Use Flyway/Liquibase; set `ddl-auto=validate` in prod |
| 28 | **Empty database passwords in local config** | `application.properties` | Use `.env` or Spring profiles |

---

*End of report.*
