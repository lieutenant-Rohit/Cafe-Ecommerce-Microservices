# 🌸 BloomsCafe V2 — Full Project Specification
## Microservices + Apache Kafka + Saga Pattern

> **Project type:** Distributed e-commerce system  
> **Reference project:** Existing BloomsCafe V1 monolith  
> **Primary goal:** Learn microservices and distributed systems through a realistic, evolving e-commerce architecture  
> **Implementation language:** Java 21 / Spring Boot  
> **Messaging:** Apache Kafka  
> **Databases:** PostgreSQL  
> **Caching:** Redis  
> **Frontend:** Existing React frontend, adapted as needed  
> **Local orchestration:** Docker Compose  
> **Load testing:** k6

---

# 1. Project Overview

BloomsCafe V2 is the distributed evolution of an existing full-stack cafe e-commerce application.

The existing BloomsCafe V1 is a functional Spring Boot monolith with:

- React frontend
- Java 21
- Spring Boot 3
- Spring Security
- JWT authentication
- Spring Data JPA
- PostgreSQL
- PostgreSQL primary + read replica
- Redis caching
- Product/catalog management
- Categories
- Cart and CartItems
- Orders and OrderItems
- Inventory/stock handling
- Admin panel
- k6 load testing
- Pessimistic locking for concurrent stock updates
- N+1 query optimizations
- Read/write database routing
- Spring Boot Actuator + Micrometer

The existing project remains intact as **BloomsCafe V1**.

BloomsCafe V2 will rebuild the backend around business-oriented microservices and gradually introduce:

1. Microservice boundaries
2. Independent data ownership
3. Service-to-service communication
4. Kafka
5. Event-driven architecture
6. Distributed transactions
7. Saga Pattern
8. Idempotency
9. Retries and failure handling
10. Transactional Outbox
11. API Gateway
12. Observability
13. Distributed load testing

The project is intentionally designed so that every technology appears because a real architectural problem requires it.

---

# 2. Primary Learning Goal

The goal is **not**:

> Build an e-commerce website using as many technologies as possible.

The goal is:

> Understand how a monolithic application evolves into a distributed system, why certain boundaries are created, what problems distribution introduces, and how those problems are solved.

The project should teach:

- Domain decomposition
- Bounded contexts
- Microservice boundaries
- Database ownership
- Service-to-service communication
- REST communication
- Synchronous vs asynchronous communication
- Kafka producers and consumers
- Kafka topics
- Partitions
- Consumer groups
- Offsets
- Event ordering
- At-least-once delivery
- Duplicate events
- Idempotency
- Eventual consistency
- Distributed transactions
- Saga Pattern
- Saga orchestration vs choreography
- Compensating transactions
- Retries
- Timeouts
- Failure recovery
- Transactional Outbox
- API Gateway
- Distributed observability
- Correlation IDs
- Horizontal scaling
- Load testing
- Distributed-system tradeoffs

---

# 3. Existing BloomsCafe V1

The existing architecture is:

```text
                    React
                      |
                      v
               Spring Boot
                      |
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      Redis       PostgreSQL      JWT
                    /    \
               Primary    Replica
```

The existing domain contains:

```text
User
Product
Category
Cart
CartItem
Order
OrderItem
Stock
```

The existing `OrderService` handles concurrent stock updates using pessimistic locking:

```sql
SELECT ... FOR UPDATE
```

The current monolith can use a local database transaction around order placement.

That is important because V2 will deliberately change the transaction boundaries.

---

# 4. V1 vs V2

## V1

```text
                 React
                   |
                   v
             Spring Boot
                   |
       ┌───────────┼───────────┐
       ↓           ↓           ↓
     User       Product      Order
       |           |           |
       └───────────┼───────────┘
                   |
              PostgreSQL
                   |
                 Redis
```

Characteristics:

- One deployable application
- One primary transactional boundary
- Shared database
- Local transactions
- Direct repository access
- Redis caching
- Read/write database routing

## V2

```text
                       React
                         |
                         v
                   API Gateway
                         |
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      User/Auth       Catalog          Order
       Service        Service         Service
                                          |
                                        Kafka
                                          |
                         ┌────────────────┼────────────────┐
                         ↓                ↓                ↓
                     Payment         Inventory         Shipping
                      Service          Service           Service
```

Characteristics:

- Independently deployable services
- Service-owned data
- Network communication
- Asynchronous events
- Eventual consistency where appropriate
- Distributed transactions
- Saga-based compensation
- Kafka-based messaging

---

# 5. Architecture Principles

## 5.1 Business capability over database entity

Do not create one microservice per entity.

Bad:

```text
User Service
Product Service
Category Service
Cart Service
Order Service
OrderItem Service
```

Instead, identify cohesive business capabilities.

Potential domains:

```text
Identity / Authentication
Catalog
Cart
Ordering
Inventory
Payment
Shipping
```

The exact service boundaries must be reasoned about before implementation.

---

## 5.2 Each service owns its data

The target principle is:

```text
User Service       → User data
Catalog Service    → Product/Category data
Order Service      → Order data
Inventory Service  → Stock data
Payment Service    → Payment data
Shipping Service   → Shipment data
```

A service must not directly manipulate another service's database tables.

---

## 5.3 Do not over-engineer the project

Do not automatically add:

- Kubernetes
- Elasticsearch
- Neo4j
- Service mesh
- Complex service discovery
- Multiple gateways
- 15+ microservices
- Cloud deployment
- Real payment integration
- Redis to every service
- PostgreSQL replicas for every service

Every technology must have a reason.

---

# 6. Candidate Service Architecture

The initial candidate architecture is:

```text
                       API Gateway
                           |
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
 User/Auth Service    Catalog Service     Order Service
                                               |
                              ┌────────────────┼────────────────┐
                              ↓                ↓                ↓
                         Inventory         Payment          Shipping
                          Service           Service           Service
```

This is a starting point, not a final locked architecture.

---

# 7. Candidate Responsibilities

## 7.1 User/Auth Service

Responsible for:

- User registration
- Login
- Password hashing
- User identity
- Roles
- JWT generation
- User profile information

Potential data:

```text
User
-----
id
name
email
passwordHash
address
role
createdAt
```

---

## 7.2 Catalog Service

Responsible for:

- Products
- Categories
- Product listing
- Product details
- Category filtering
- Product administration
- Product caching

Potential data:

```text
Product
--------
id
name
description
price
imageUrl
categoryId
```

```text
Category
--------
id
name
```

The Catalog Service owns product and category information.

---

## 7.3 Cart

Cart requires an explicit architectural decision.

Possible choices:

### Option A

Cart belongs to Order Service.

### Option B

Cart becomes a separate Cart Service.

### Option C

Cart remains close to the user/order domain but uses its own persistence.

We should compare:

- ownership
- scaling
- coupling
- transaction requirements
- learning value
- complexity

before deciding.

---

## 7.4 Order Service

Responsible for:

- Creating orders
- Order lifecycle
- Order items
- Order history
- Order status
- Customer order retrieval
- Initiating order workflows

Potential data:

```text
Order
-----
id
userId
totalPrice
status
createdAt
```

```text
OrderItem
---------
id
orderId
productId
quantity
priceAtPurchase
```

Important:

The Order Service should not directly modify inventory or payment data.

---

## 7.5 Inventory Service

Responsible for:

- Stock quantities
- Stock reservation
- Stock release
- Stock confirmation
- Inventory failures

Potential data:

```text
Inventory
---------
productId
availableQuantity
reservedQuantity
updatedAt
```

The Inventory Service owns stock.

---

## 7.6 Payment Service

Responsible for:

- Payment creation
- Payment processing
- Payment status
- Payment failure
- Refunds

Potential data:

```text
Payment
-------
id
orderId
amount
status
transactionId
createdAt
```

Possible statuses:

```text
PENDING
SUCCESS
FAILED
REFUNDED
```

No real payment provider is required.

The service will be a local/mock payment provider capable of simulating:

- success
- failure
- timeout
- delayed processing

---

## 7.7 Shipping Service

Shipping is optional in the earliest phase but useful for demonstrating a complete Saga.

Responsible for:

- Shipment creation
- Shipment status
- Shipment cancellation

Potential data:

```text
Shipment
--------
id
orderId
status
address
createdAt
```

Possible statuses:

```text
PENDING
CREATED
FAILED
CANCELLED
```

---

# 8. Database Architecture

The target logical ownership is:

```text
User Service
     |
     v
User DB

Catalog Service
     |
     v
Catalog DB

Order Service
     |
     v
Order DB

Inventory Service
     |
     v
Inventory DB

Payment Service
     |
     v
Payment DB

Shipping Service
     |
     v
Shipping DB
```

For local development, these databases may initially run inside one PostgreSQL instance using separate databases or schemas.

The important architectural rule is logical ownership.

---

# 9. Service Communication Strategy

We will use two communication styles.

## Synchronous communication

Used when an immediate response is required.

Example:

```text
Order Service
      |
      | HTTP
      v
Catalog Service
```

Potential use cases:

- retrieving product information
- user authentication
- synchronous validation where justified

---

## Asynchronous communication

Used when services can react independently.

Example:

```text
Order Service
      |
      | OrderCreated
      v
    Kafka
      |
      ├──────> Payment Service
      |
      └──────> Inventory Service
```

Kafka will be introduced only after the synchronous model is understood.

---

# 10. Why Kafka?

Kafka provides:

- durable event storage
- asynchronous communication
- decoupling between producers and consumers
- replayable events
- consumer groups
- partitioning
- scalable event processing

It should not be treated as merely:

> "A queue."

The project should explicitly demonstrate Kafka's concepts.

---

# 11. Initial Kafka Concepts

We should learn:

```text
Producer
Consumer
Topic
Partition
Offset
Consumer Group
Broker
```

Example:

```text
Order Service
     |
     | produce
     v
orders topic
     |
     ├── partition 0
     ├── partition 1
     └── partition 2
```

Consumers:

```text
Payment Service
Inventory Service
```

can independently consume the same logical event stream.

---

# 12. Event Examples

Potential events:

```text
OrderCreated
PaymentRequested
PaymentSucceeded
PaymentFailed
InventoryReservationRequested
InventoryReserved
InventoryReservationFailed
InventoryReleased
OrderConfirmed
OrderCancelled
RefundRequested
RefundCompleted
ShipmentCreated
ShipmentFailed
```

Event contracts should be designed carefully.

Do not randomly create dozens of events.

Start with the minimum event set needed for the order workflow.

---

# 13. Order Workflow

The central workflow is:

```text
Customer
   |
   v
Order Service
   |
   | Create Order
   v
PENDING
```

Then the distributed workflow begins.

A possible final flow:

```text
Order Created
      |
      v
Kafka
      |
      ├──────────────> Payment
      |
      └──────────────> Inventory
```

Successful flow:

```text
Order
  ↓
Payment ✓
  ↓
Inventory ✓
  ↓
Shipping ✓
  ↓
Order CONFIRMED
```

The exact sequence must be decided carefully.

---

# 14. Distributed Transaction Problem

In V1:

```text
BEGIN TRANSACTION

Create Order
Update Stock
Process Payment

COMMIT
```

A local transaction can protect operations in the same database.

In V2:

```text
Order DB
Payment DB
Inventory DB
Shipping DB
```

There is no simple global transaction:

```text
ROLLBACK EVERYTHING
```

This creates the need for a distributed transaction strategy.

---

# 15. Saga Pattern

Saga is the mechanism we will use to coordinate the distributed business transaction.

A Saga consists of multiple local transactions:

```text
Create Order
     ↓
Reserve Inventory
     ↓
Process Payment
     ↓
Create Shipment
```

If everything succeeds:

```text
Order ✓
Inventory ✓
Payment ✓
Shipping ✓
```

If a later operation fails:

```text
Order ✓
Inventory ✓
Payment ✓
Shipping ✗
```

we perform compensating actions.

Example:

```text
Shipping failed
      ↓
Refund Payment
      ↓
Release Inventory
      ↓
Cancel Order
```

Saga does not magically roll back previous database commits.

Instead, it performs new business operations that compensate for previous operations.

---

# 16. Saga Compensation Examples

```text
Forward Action              Compensation

Create Order             →   Cancel Order

Reserve Inventory        →   Release Inventory

Charge Payment           →   Refund Payment

Create Shipment          →   Cancel Shipment
```

Compensation must itself be reliable and idempotent.

---

# 17. Saga Architecture Decision

We will compare two approaches.

## Choreography

```text
Order
  |
  v
Kafka
  |
  v
Payment
  |
  v
Kafka
  |
  v
Inventory
```

Services react to events.

Advantages:

- Decoupled
- Naturally event-driven
- No central coordinator

Disadvantages:

- Workflow becomes difficult to visualize
- Complex workflows can become difficult to debug
- Business process can become distributed across many services

---

## Orchestration

```text
             Saga Orchestrator
              /      |       \
             ↓       ↓        ↓
          Order   Payment   Inventory
```

The orchestrator controls the workflow.

Advantages:

- Central workflow visibility
- Easier to understand complex transactions
- Easier compensation logic

Disadvantages:

- Orchestrator becomes important infrastructure
- More centralized coordination
- Potential coupling through orchestration logic

We will choose deliberately after understanding both.

---

# 18. Order State Machine

A possible order state model:

```text
PENDING
   |
   v
PAYMENT_PENDING
   |
   ├──────> PAYMENT_FAILED
   |
   v
PAYMENT_SUCCESS
   |
   v
INVENTORY_PENDING
   |
   ├──────> INVENTORY_FAILED
   |
   v
INVENTORY_RESERVED
   |
   v
SHIPPING_PENDING
   |
   ├──────> SHIPPING_FAILED
   |
   v
CONFIRMED
```

Cancellation paths must also be modeled.

The final state machine should be derived from the chosen Saga workflow rather than copied blindly.

---

# 19. Idempotency

Distributed systems can process the same message more than once.

Example:

```text
OrderCreated
OrderCreated
```

Payment must not charge twice.

A consumer should be able to determine:

```text
Has this event already been processed?
```

Example:

```text
eventId
   |
   v
Processed Events
   |
   ├── YES → Ignore safely
   |
   └── NO  → Process
```

Potential idempotency keys:

- event ID
- order ID + operation
- payment transaction ID

The correct key depends on the operation.

---

# 20. Failure Scenarios

The project must deliberately simulate failures.

## Scenario 1 — Payment failure

```text
Order Created
      ↓
Payment Failed
      ↓
Order Cancelled
```

---

## Scenario 2 — Inventory failure after payment

```text
Order Created
      ↓
Payment Successful
      ↓
Inventory Failed
      ↓
Refund Payment
      ↓
Cancel Order
```

---

## Scenario 3 — Consumer failure

```text
Kafka
  |
  v
Payment Consumer
  X
```

The service crashes.

After restart, the message should be processed safely.

---

## Scenario 4 — Duplicate event

```text
OrderCreated
OrderCreated
```

The second delivery must not produce a second payment.

---

## Scenario 5 — Timeout

```text
Order
  |
  v
Payment
  |
  X
Timeout
```

The system must distinguish between:

- payment definitely failed
- payment response unknown
- payment may have succeeded but response was lost

This is a critical distributed-systems problem.

---

## Scenario 6 — Compensation failure

```text
Inventory failed
      ↓
Refund Payment
      X
```

Now the compensation itself failed.

The system needs a strategy for retrying and recovering the compensation.

---

# 21. Eventual Consistency

V1 can often provide immediate consistency through a local transaction.

V2 will introduce eventual consistency.

Example:

```text
Order created
      ↓
Payment pending
      ↓
Inventory pending
      ↓
Payment successful
      ↓
Inventory successful
      ↓
Order confirmed
```

For a short period, different services may have different views of the order.

This is expected.

The system should converge to a consistent final state.

---

# 22. Outbox Pattern

Eventually we will face this problem:

```text
Database transaction
        +
Kafka publish
```

These are two separate operations.

Failure example:

```text
DB commit ✓
Kafka publish ✗
```

The order exists but the event was not published.

Another:

```text
Kafka publish ✓
DB commit ✗
```

Consumers receive an event for a transaction that did not commit.

The Transactional Outbox Pattern solves this by writing the event into the same database transaction:

```text
Order Transaction
      |
      ├── Order row
      |
      └── Outbox row
             |
             v
       Outbox Publisher
             |
             v
           Kafka
```

This will be introduced after the basic Kafka/Saga implementation is understood.

---

# 23. API Gateway

The final system can have:

```text
React
  |
  v
API Gateway
  |
  ├── User Service
  ├── Catalog Service
  └── Order Service
```

The gateway may handle:

- routing
- authentication
- rate limiting
- request IDs
- centralized entry point

Keep it lightweight.

Do not turn the gateway into a separate major project.

---

# 24. Authentication

The existing V1 uses JWT.

For V2, authentication should remain stateless.

Potential flow:

```text
React
  |
  | login
  v
User/Auth Service
  |
  v
JWT
  |
  v
React
```

Then:

```text
React
  |
  | Authorization: Bearer JWT
  v
API Gateway
  |
  v
Service
```

We need to decide whether:

- Gateway validates JWT
- Each service validates JWT
- Gateway validates and forwards trusted identity information
- A combination is used

This is an architectural decision and should not be assumed.

---

# 25. Redis

Redis can continue to be used for Catalog caching.

Example:

```text
Catalog Service
      |
      v
    Redis
      |
   cache miss
      |
      v
 Catalog DB
```

Possible cached data:

- product lists
- category lists
- individual products

Writes should invalidate affected cache entries.

Do not introduce Redis into every service without a clear requirement.

---

# 26. PostgreSQL

Each service logically owns its database.

A practical local setup may be:

```text
PostgreSQL
 ├── blooms_user
 ├── blooms_catalog
 ├── blooms_order
 ├── blooms_inventory
 ├── blooms_payment
 └── blooms_shipping
```

This is acceptable for local development because logical ownership matters more than physically running six database servers.

Later, if useful, we can discuss separate PostgreSQL instances.

---

# 27. Docker Compose

Eventually the system should be runnable locally through Docker Compose.

Potential containers:

```text
blooms-gateway
blooms-user-service
blooms-catalog-service
blooms-order-service
blooms-inventory-service
blooms-payment-service
blooms-shipping-service

postgres
redis
kafka
```

The exact infrastructure may change.

Build services first, then containerize them.

---

# 28. Observability

Distributed systems are difficult to debug without observability.

Eventually introduce:

- Spring Boot Actuator
- Micrometer
- Prometheus
- structured logs
- correlation IDs
- health checks

Example:

```text
Request ID: abc-123

Gateway
   ↓
Order Service
   ↓
Kafka
   ↓
Payment Service
   ↓
Payment DB
```

The same correlation ID should make the request traceable across services.

---

# 29. Load Testing

The V1 project already uses k6.

V2 should reuse that knowledge.

We should compare:

```text
BloomsCafe V1
        vs
BloomsCafe V2
```

Measure:

- throughput
- p50 latency
- p95 latency
- p99 latency
- error rate
- database utilization
- Redis hit ratio
- Kafka throughput
- consumer lag
- service bottlenecks
- recovery time after failures

The goal is not necessarily to make V2 faster.

The goal is to understand the tradeoffs introduced by distribution.

---

# 30. Development Phases

## Phase 1 — Understand V1

Study:

- entities
- services
- repositories
- transactions
- stock locking
- Redis
- database routing
- authentication

---

## Phase 2 — Domain Decomposition

Identify business boundaries.

Decide:

- User/Auth
- Catalog
- Cart
- Order
- Inventory
- Payment
- Shipping

Do not assume every candidate becomes a service.

---

## Phase 3 — Microservice Skeleton

Create independently runnable Spring Boot services.

Do not add Kafka yet.

---

## Phase 4 — Database Ownership

Give each service logical ownership of its data.

---

## Phase 5 — Synchronous Communication

Implement basic REST communication where appropriate.

Learn:

- HTTP
- timeouts
- failures
- retries
- service availability

---

## Phase 6 — Distributed Order Flow

Build the basic order workflow across services.

---

## Phase 7 — Kafka

Introduce:

- topics
- producers
- consumers
- consumer groups
- offsets
- partitions
- events

---

## Phase 8 — Saga

Introduce:

- distributed transaction coordination
- compensation
- order state machine
- failure handling

---

## Phase 9 — Reliability

Implement:

- idempotency
- retries
- timeouts
- duplicate handling
- consumer recovery
- compensation recovery

---

## Phase 10 — Outbox

Implement reliable database-to-Kafka event publication.

---

## Phase 11 — API Gateway

Introduce:

- routing
- authentication strategy
- request IDs
- rate limiting if justified

---

## Phase 12 — Observability

Add:

- metrics
- logs
- health checks
- correlation IDs
- Prometheus

---

## Phase 13 — Load Testing

Run k6 against V2.

Compare it with V1.

Document:

- performance
- bottlenecks
- failure behavior
- scalability
- operational complexity

---

# 31. Target Architecture

The final architecture should roughly evolve toward:

```text
                         React
                           |
                           v
                     API Gateway
                           |
          ┌────────────────┼────────────────┐
          │                │                │
          v                v                v
       User/Auth        Catalog           Order
        Service         Service           Service
                                             |
                                             |
                                            Kafka
                                             |
                           ┌─────────────────┼─────────────────┐
                           │                 │                 │
                           v                 v                 v
                       Payment           Inventory          Shipping
                       Service            Service            Service
                           │                 │                 │
                           v                 v                 v
                       Payment DB       Inventory DB       Shipping DB
```

Each service owns its data.

Kafka connects asynchronous workflows.

Saga manages the distributed order transaction.

The API Gateway provides the external entry point.

---

# 32. What Should NOT Be Assumed

The following are intentionally open architectural decisions:

- Final service boundaries
- Whether Cart is its own service
- Whether Shipping is included from day one
- REST vs gRPC for internal communication
- Kafka topic structure
- Event schema format
- Saga choreography vs orchestration
- Database-per-service physical deployment
- JWT validation location
- Redis usage per service
- API Gateway implementation
- Retry strategy
- Dead-letter strategy
- Outbox implementation
- Kafka partitioning strategy

These decisions should be made based on actual requirements and learning objectives.

---

# 33. How We Should Work Together

When working on this project:

1. Do not jump directly into implementation.
2. Explain the current architectural problem first.
3. Present reasonable options.
4. Explain pros and cons.
5. Connect the decision to distributed-system concepts.
6. Let me reason about the decision.
7. Once decided, lock it.
8. Implement the smallest useful version.
9. Test it.
10. Move to the next concept.

Do not silently choose between multiple reasonable architectures.

If there are tradeoffs, explicitly explain them.

---

# 34. Teaching Style

I prefer:

```text
Concept
   ↓
Simple BloomsCafe example
   ↓
Diagram
   ↓
Why do we need it?
   ↓
Options
   ↓
Tradeoffs
   ↓
Decision
   ↓
Implementation
   ↓
Test
```

I do NOT prefer:

```text
Huge explanation
+
20 concepts
+
500 lines of code
```

If I ask a small question, answer the small question.

Do not continue into five future topics unless I ask.

---

# 35. Core Learning Progression

The project should naturally follow this progression:

```text
Existing Monolith
        ↓
Identify Business Boundaries
        ↓
Microservices
        ↓
Independent Data Ownership
        ↓
Service-to-Service Communication
        ↓
Synchronous REST
        ↓
Need for Asynchronous Communication
        ↓
Kafka
        ↓
Event-Driven Architecture
        ↓
Distributed Transaction Problem
        ↓
Saga
        ↓
Compensation
        ↓
Duplicate Events
        ↓
Idempotency
        ↓
Retries + Timeouts
        ↓
Database + Kafka Consistency Problem
        ↓
Outbox Pattern
        ↓
Observability
        ↓
Load Testing
```

Every step should be introduced because the previous step creates a real problem.

---

# 36. Success Criteria

At the end of BloomsCafe V2, I should be able to explain the architecture from first principles.

I should be able to answer:

### Why microservices?

Because business capabilities can have independent ownership, scaling, deployment, and transaction boundaries.

### Why separate databases?

To enforce service ownership and prevent direct database coupling.

### Why synchronous communication?

For operations that require an immediate response.

### Why Kafka?

For asynchronous, decoupled event-driven workflows.

### Why Saga?

Because the order workflow spans independent services/databases and cannot rely on one local ACID transaction.

### Why compensation?

Because previous successful local transactions cannot simply be rolled back globally.

### Why idempotency?

Because distributed event delivery may produce duplicates.

### Why retries?

Because network and service failures are normal in distributed systems.

### Why Outbox?

Because database commits and Kafka publishes are separate operations.

### Why API Gateway?

Because external clients need a controlled entry point into multiple services.

### Why observability?

Because failures and requests now cross service boundaries.

---

# 37. Final Project Philosophy

The project is not successful merely because it contains:

```text
Microservices
Kafka
Saga
Redis
Docker
PostgreSQL
```

The real success condition is:

> **I understand why the system needs each component, what problem it solves, what tradeoffs it introduces, and how the distributed system behaves when things fail.**

The existing BloomsCafe V1 is the reference implementation.

BloomsCafe V2 is the distributed evolution.

The project should remain small enough to finish, but deep enough to demonstrate real distributed-system engineering.

---

# 38. Immediate Next Step

Do NOT start coding yet.

The first task is:

> **Analyze the existing BloomsCafe domain and identify the correct microservice boundaries.**

Start with:

```text
User
Product
Category
Cart
CartItem
Order
OrderItem
Stock
Payment
```

Ask:

- Which entities belong together?
- Which service owns each piece of data?
- Which operations require transactions?
- Which services need to communicate?
- Which services should scale independently?
- Which services need independent databases?
- Where are the natural transaction boundaries?
- Where will distributed transactions appear?

Only after these boundaries are understood should we create the first microservice.

---

# 39. Golden Rule

> **One concept at a time.**

Do not introduce Kafka before we understand why we need asynchronous communication.

Do not introduce Saga before we understand the distributed transaction problem.

Do not introduce Outbox before we understand the database/Kafka consistency problem.

Do not introduce complex infrastructure before the services themselves are understood.

Build the system in a way where every architectural decision has a reason.
