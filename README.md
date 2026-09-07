# BloomCafeV2

A full-stack cafe ordering platform built with a **microservices backend** (Java / Spring Boot) and a **React SPA frontend**. Customers can browse the menu, manage their cart, and place orders — while admins manage products, categories, inventory, orders, and users through a dedicated admin panel.

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
                         │         Frontend (React)        │
                         │    Vite Dev Server (:5173)      │
                         └──────────────┬──────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────────┐
                         │     Nginx Reverse Proxy (:8080) │
                         │   CORS  ·  Load Balancing  · JWT│
                         └──┬───┬───┬───┬───┬───┬──────────┘
                            │   │   │   │   │   │
                ┌───────────┘   │   │   │   │   └──────────┐
                ▼               ▼   │   ▼   ▼              ▼
          ┌──────────┐  ┌──────────┐│┌──────────┐  ┌────────────┐
          │  User    │  │ Catalog  │││  Order   │  │ Inventory  │
          │ (:8081)  │  │ (:8082)  │││ (:8084)  │  │  (:8085)   │
          └────┬─────┘  └────┬─────┘│└────┬─────┘  └─────┬──────┘
               │             │      │     │               │
               │             │  ┌───┘     │               │
               │             │  │  ┌──────┘               │
               │             │  ▼  ▼                      │
               │             │ ┌──────────┐               │
               │             │ │  Cart    │               │
               │             │ │ (:8083)  │               │
               │             │ └────┬─────┘               │
               │             │      │                     │
               │             │      │    ┌───────────┐    │
               │             │      └───►│Inventory  │◄───┘
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

## Prerequisites

- **Java 21** or later (for local development)
- **Node.js 18+** and npm (for local development)
- **PostgreSQL 16+** running on `localhost:5432` (for local development)
- **Docker & Docker Compose** (for containerized setup)

---

## Quick Start (Docker)

The fastest way to run the entire project — one command:

```bash
docker-compose up --build
```

This builds and starts **all** services:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost:8080 |
| **User Service** | http://localhost:8081 |
| **Catalog Service** | http://localhost:8082 |
| **Cart Service** | http://localhost:8083 |
| **Order Service** | http://localhost:8084 |
| **Inventory Service** | http://localhost:8085 |
| **Notification Service** | http://localhost:8086 |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |
| **Kafka** | localhost:9092 |

To stop everything:

```bash
docker-compose down
```

To stop and remove databases:

```bash
docker-compose down -v
```

---

## Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/BloomCafeV2.git
cd BloomCafeV2
```

### 2. Start infrastructure services

```bash
docker-compose up -d
```

This starts:
- **Kafka** (KRaft mode, no Zookeeper) on port `9092`
- **Redis** on port `6379`

### 3. Create PostgreSQL databases

```sql
CREATE DATABASE blooms_user;
CREATE DATABASE blooms_catalog;
CREATE DATABASE blooms_cart;
CREATE DATABASE blooms_order;
CREATE DATABASE blooms_inventory;
```

### 4. Set environment variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key-here
```

Each backend service reads `JWT_SECRET` from the environment for JWT signing.

### 5. Start backend services

Open separate terminals for each service:

```bash
# Terminal 1 - User Service
cd backend/user-service
./mvnw spring-boot:run

# Terminal 2 - Catalog Service
cd backend/catalog-service
./mvnw spring-boot:run

# Terminal 3 - Cart Service
cd backend/cart-service
./mvnw spring-boot:run

# Terminal 4 - Order Service
cd backend/order-service
./mvnw spring-boot:run

# Terminal 5 - Inventory Service
cd backend/inventory-service
./mvnw spring-boot:run

# Terminal 6 - Notification Service
cd backend/notification-service
./mvnw spring-boot:run
```

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to Nginx on port `8080`.

### 7. Start Nginx (optional, for production-like routing)

```bash
nginx -c /path/to/nginx.conf
```

Or run with Docker:

```bash
docker run -d --name nginx -p 8080:8080 -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine
```

---

## Project Structure

```
BloomCafeV2/
├── docker-compose.yml          # Kafka (KRaft mode), Redis
├── nginx.conf                  # Reverse proxy & API gateway
├── cors-headers.conf           # Shared CORS headers for Nginx
├── .env                        # JWT_SECRET (not committed)
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts          # Dev proxy → :8080
│   ├── tailwind.config.js      # Custom cafe color palette
│   ├── src/
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Auth init + cart hydration
│   │   ├── router/index.tsx    # All routes with Framer Motion
│   │   ├── store/              # Zustand stores (auth, cart)
│   │   ├── api/                # Axios API clients (6 modules)
│   │   ├── types/index.ts      # TypeScript interfaces
│   │   ├── pages/              # Public pages (Home, Menu, Cart...)
│   │   ├── pages/admin/        # Admin panel (Dashboard, CRUD...)
│   │   ├── components/         # UI components, layout, animations
│   │   ├── hooks/              # Custom hooks (useCafeStatus)
│   │   └── utils/              # JWT helpers
│   └── public/                 # Static assets
│
├── backend/
│   ├── user-service/           # :8081 — Auth, JWT, User CRUD
│   ├── catalog-service/        # :8082 — Products, Categories, Redis
│   ├── cart-service/           # :8083 — Shopping cart, Kafka consumer
│   ├── order-service/          # :8084 — Order orchestration, Kafka producer
│   ├── inventory-service/      # :8085 — Stock management
│   ├── notification-service/   # :8086 — Kafka consumer, WebSocket push
│   ├── gateway-service/        # (placeholder)
│   └── payment-service/        # (placeholder)
```

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

## Available Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Backend (per service)

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Start the service |
| `./mvnw package` | Build the JAR |
| `./mvnw test` | Run tests |

---

## Contributing

Contributions are welcome! Whether it's a bug report, a feature request, or a pull request — every bit helps.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m "Add your feature"`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

### Ideas for contributions

- Implement the **payment service** (Stripe, Razorpay, etc.)
- Add **unit and integration tests** for backend services
- Set up a proper **API gateway** (Spring Cloud Gateway / Kong)
- Add **CI/CD** with GitHub Actions
- Improve **error handling** and add React error boundaries
- Add **Docker Compose** definitions for all backend services
- Write **API documentation** with Swagger/OpenAPI

Feel free to open an issue to discuss ideas before diving into code.

---

## Support

If you found this project helpful:

- Give it a star on GitHub
- Share it with others who might benefit
- Open an issue if you run into problems

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


