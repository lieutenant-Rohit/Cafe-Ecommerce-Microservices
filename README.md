# BloomCafeV2

A full-stack cafe ordering platform built with a **microservices backend** (Java / Spring Boot) and a **React SPA frontend**. Located on **Rajpur Road, Dehradun**. Customers can browse the menu, manage their cart, and place orders — while admins manage products, categories, inventory, orders, and users through a dedicated admin panel.

---

## Quick Start (Docker)

```bash
git clone https://github.com/lieutenant-Rohit/BloomCafeV2.git
cd BloomCafeV2
docker compose up --build
```

Wait for all services to start (first build takes a few minutes). Then open:

- **Frontend:** http://localhost:3100
- **API Gateway:** http://localhost:8180

To stop everything:
```bash
docker compose down
```

To stop and wipe the database:
```bash
docker compose down -v
```

### What's running

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3100 | React SPA served by Nginx |
| Nginx Gateway | 8180 | Reverse proxy, routes `/api/*` to backend |
| User Service | 8081 | Auth, JWT, user management |
| Catalog Service | 8082 | Products, categories, Redis cache |
| Cart Service | 8083 | Shopping cart, Kafka consumer |
| Order Service | 8084 | Order orchestration, Kafka producer |
| Inventory Service | 8085 | Stock management |
| Notification Service | 8086 | Kafka consumer, WebSocket push |
| PostgreSQL | 5432 | 5 databases (one per service) |
| Redis | 6379 | Catalog caching |
| Kafka | 9092 | Async inter-service messaging |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Reusable UI components |
| Zustand | State management |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| Framer Motion | Page transitions & animations |
| Lenis | Smooth scrolling |

### Backend

| Technology | Purpose |
|------------|---------|
| Java 21 | Language |
| Spring Boot 4.x | Application framework |
| Spring Security | JWT authentication & role-based access |
| Spring Data JPA | ORM / database access |
| Spring Kafka | Event-driven messaging |
| Spring WebSocket | Real-time push notifications |
| PostgreSQL | Primary database (one per service) |
| Redis | Caching layer (catalog service) |
| Apache Kafka | Async inter-service messaging |
| Lombok | Boilerplate reduction |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker Compose | Container orchestration |
| Nginx | Reverse proxy & API gateway |

---

## Architecture

```
                         ┌─────────────────────────────────┐
                         │      Frontend (React + Nginx)   │
                         │          http://:3100           │
                         └──────────────┬──────────────────┘
                                        │ /api/*
                                        ▼
                         ┌─────────────────────────────────┐
                         │     Nginx API Gateway (:8180)   │
                         │   CORS  ·  Routing  ·  JWT      │
                         └──┬───┬───┬───┬───┬──────────────┘
                            │   │   │   │   │
                ┌───────────┘   │   │   │   └──────────┐
                ▼               ▼   │   ▼              ▼
          ┌──────────┐  ┌──────────┐│┌──────────┐  ┌────────────┐
          │  User    │  │ Catalog  │││  Order   │  │ Inventory  │
          │ (:8081)  │  │ (:8082)  │││ (:8084)  │  │  (:8085)   │
          └────┬─────┘  └────┬─────┘│└────┬─────┘  └─────┬──────┘
               │             │      │     │              │
               │             │  ┌───┘     │              │
               │             │  │  ┌──────┘              │
               │             │  ▼  ▼                     │
               │             │ ┌──────────┐              │
               │             │ │  Cart    │              │
               │             │ │ (:8083)  │              │
               │             │ └────┬─────┘              │
               │             │      │                    │
               │             │      │    ┌───────────┐   │
               │             │      └───►│Inventory  │◄──┘
               │             │           │ Reserve   │
               │             │           └─────┬─────┘
               │             │                 │
               │             │      ┌──────────┘
               │             │      ▼
               │             │  ┌──────────────┐
               │             │  │ Notification │
               │             │  │  (:8086)     │
               │             │  │  WebSocket   │
               │             │  └──────────────┘
               │             │
               ▼             ▼
          ┌──────────────────────────────┐
          │     PostgreSQL Databases     │
          │  blooms_user · blooms_catalog│
          │  blooms_cart  · blooms_order │
          │  blooms_inventory            │
          └──────────────────────────────┘
```

**Communication patterns:**
- **Synchronous (REST):** Cart → Catalog (product validation), Order → Cart/Catalog/Inventory (checkout orchestration)
- **Asynchronous (Kafka):** Order → Cart (auto-clear), Order → Notification (real-time push)
- **WebSocket/STOMP:** Notification → Frontend (live order status updates)

---

## Features

### Customer
- Browse paginated product catalog with category filtering
- Add, update, and remove items from shopping cart
- Dual-mode cart: backend-synced when authenticated, local storage when anonymous
- Place orders with automatic inventory reservation
- View order history with real-time status updates
- Responsive UI with smooth scroll, page transitions, and micro-interactions

### Admin
- Dashboard with order and user overview
- Full CRUD management for products, categories, orders, users, and inventory
- Role-based access control (CUSTOMER / ADMIN)
- Order status lifecycle management

### Technical
- Stateless JWT authentication with 1-hour expiry
- Redis caching on catalog reads (10-minute TTL)
- Saga-like compensating transactions for distributed checkout
- Event-driven architecture with Kafka for async decoupling
- Per-service database isolation (database-per-service pattern)

---

## Creating an Account

The app doesn't seed any users. To get started, register at http://localhost:3100/register, then promote yourself to admin:

```sql
-- Connect to the database
psql -U root1 -d blooms_user

-- Update your role (replace the email with yours)
UPDATE users SET role='ADMIN' WHERE email='your@email.com';
```

Or via Docker:
```bash
docker exec -it blooms-postgres psql -U root1 -d blooms_user -c "UPDATE users SET role='ADMIN' WHERE email='your@email.com';"
```

---

## Project Structure

```
BloomCafeV2/
├── docker-compose.yml          # Full stack orchestration
├── init.sql                    # Auto-creates PostgreSQL databases
├── nginx.conf                  # API gateway routing
├── cors-headers.conf           # Shared CORS headers for Nginx
├── .env                        # JWT_SECRET
│
├── frontend/
│   ├── Dockerfile              # Multi-stage: Node build + Nginx serve
│   ├── nginx.conf              # SPA routing + API proxy
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── main.tsx            # React entry point
│       ├── App.tsx             # Auth init + cart hydration
│       ├── router/index.tsx    # All routes with Framer Motion
│       ├── store/              # Zustand stores (auth, cart)
│       ├── api/                # Axios API clients (6 modules)
│       ├── types/index.ts      # TypeScript interfaces
│       ├── pages/              # Public pages (Home, Menu, Cart...)
│       ├── pages/admin/        # Admin panel (Dashboard, CRUD...)
│       ├── components/         # UI components, layout, animations
│       ├── hooks/              # Custom hooks (useCafeStatus)
│       └── utils/              # JWT helpers
│
├── backend/
│   ├── user-service/           # :8081 — Auth, JWT, User CRUD
│   ├── catalog-service/        # :8082 — Products, Categories, Redis
│   ├── cart-service/           # :8083 — Shopping cart, Kafka consumer
│   ├── order-service/          # :8084 — Order orchestration, Kafka producer
│   ├── inventory-service/      # :8085 — Stock management
│   └── notification-service/   # :8086 — Kafka consumer, WebSocket push
```

---

## Local Development (without Docker)

If you prefer running services locally:

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 16+ on `localhost:5432`
- Docker (only for Kafka + Redis)

### 1. Start infrastructure
```bash
docker compose up -d redis kafka
```

### 2. Create databases
```sql
CREATE DATABASE blooms_user;
CREATE DATABASE blooms_catalog;
CREATE DATABASE blooms_cart;
CREATE DATABASE blooms_order;
CREATE DATABASE blooms_inventory;
```

### 3. Set environment variable
```bash
export JWT_SECRET=your-secret-key-here
```

### 4. Start backend services (6 terminals)
```bash
cd backend/user-service && ./mvnw spring-boot:run
cd backend/catalog-service && ./mvnw spring-boot:run
cd backend/cart-service && ./mvnw spring-boot:run
cd backend/order-service && ./mvnw spring-boot:run
cd backend/inventory-service && ./mvnw spring-boot:run
cd backend/notification-service && ./mvnw spring-boot:run
```

### 5. Start frontend
```bash
cd frontend && npm install && npm run dev
```

Frontend runs on http://localhost:5173 and proxies API requests to the backend services.

---

## API Endpoints

### Auth (`user-service` — :8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Users (`user-service` — :8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users *(admin)* |
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/users/{id}` | Get user by ID *(admin)* |
| DELETE | `/api/users/{id}` | Delete user *(admin)* |

### Products (`catalog-service` — :8082)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated) |
| GET | `/api/products/batch` | Get products by IDs (`?ids=1,2,3`) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/category/{categoryId}` | List products by category |
| POST | `/api/products` | Create product *(admin)* |
| PUT | `/api/products/{id}` | Update product *(admin)* |
| DELETE | `/api/products/{id}` | Delete product *(admin)* |

### Categories (`catalog-service` — :8082)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories (paginated) |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create category *(admin)* |
| PUT | `/api/categories/{id}` | Update category *(admin)* |
| DELETE | `/api/categories/{id}` | Delete category *(admin)* |

### Cart (`cart-service` — :8083)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/carts` | Create cart for current user |
| GET | `/api/carts` | Get current user's cart |
| GET | `/api/carts/user/{userId}` | Get cart by user ID |
| POST | `/api/carts/items` | Add item (`?productId=&quantity=`) |
| PUT | `/api/carts/items/{productId}` | Update item quantity |
| DELETE | `/api/carts/items/{productId}` | Remove item from cart |
| DELETE | `/api/carts/items` | Clear cart |

### Orders (`order-service` — :8084)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/checkout` | Preview cart for checkout |
| POST | `/api/orders` | Place order (orchestrates inventory + cart) |
| GET | `/api/orders` | Get current user's orders |
| GET | `/api/orders/{orderId}` | Get order by ID |
| PATCH | `/api/orders/{orderId}/status` | Update order status *(admin)* |
| DELETE | `/api/orders/{orderId}` | Delete order *(admin)* |

### Inventory (`inventory-service` — :8085)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory/{productId}` | Get inventory for product |
| POST | `/api/inventory` | Create inventory record |
| POST | `/api/inventory/{productId}/reserve` | Reserve stock (`?quantity=`) |
| POST | `/api/inventory/{productId}/release` | Release reserved stock |

### Notifications (`notification-service` — :8086)

No REST endpoints. Listens to Kafka `order-created` topic and pushes WebSocket/STOMP notifications to `/topic/orders/{userId}`.

---

## Frontend Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/menu` | Menu | Public |
| `/cart` | Cart | Public |
| `/my-orders` | MyOrders | Public |
| `/admin` | Dashboard | Admin |
| `/admin/products` | Products | Admin |
| `/admin/categories` | Categories | Admin |
| `/admin/orders` | Orders | Admin |
| `/admin/users` | Users | Admin |
| `/admin/inventory` | Inventory | Admin |

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m "Add your feature"`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

### Ideas for contributions

- Implement the **payment service** (Stripe, Razorpay, etc.)
- Add **unit and integration tests** for backend services
- Set up **CI/CD** with GitHub Actions
- Write **API documentation** with Swagger/OpenAPI

---

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) — Backend framework
- [React](https://react.dev/) — Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI component inspiration
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Apache Kafka](https://kafka.apache.org/) — Event-driven messaging
- [Redis](https://redis.io/) — Caching
- [Docker](https://www.docker.com/) — Containerization

