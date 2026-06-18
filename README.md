# Albertsons Product Search System

A full-stack grocery product search application.The system demonstrates a complete **Spring Boot REST API backend** connected to a **React (Vite) frontend**, showcasing real-world enterprise patterns including layered architecture, JPA/Hibernate ORM, in-memory database seeding, and a service-oriented frontend.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend API Reference](#backend-api-reference)
- [Database](#database)
- [Frontend Details](#frontend-details)
- [Design Patterns Used](#design-patterns-used)

---

## Architecture Overview

```
┌──────────────────────┐         HTTP (REST/JSON)        ┌──────────────────────────────┐
│                      │  ◄──────────────────────────►   │                              │
│   React Frontend     │    Vite Dev Proxy (/api → :8080)│   Spring Boot Backend        │
│   (Vite + Tailwind)  │                                 │   (Java 17, Maven)           │
│   Port: 3000         │                                 │   Port: 8080                 │
│                      │                                 │                              │
│  ┌────────────────┐  │                                 │  ┌────────────────────────┐  │
│  │ ProductService │──┼─── GET /api/products ──────────►│  │ ProductController      │  │
│  │ (Service Layer)│  │                                 │  │ (@RestController)      │  │
│  │                │──┼─── POST /api/products ─────────►│  │                        │  │
│  └────────────────┘  │                                 │  └──────────┬─────────────┘  │
│                      │                                 │             │                │
│  ┌────────────────┐  │                                 │  ┌──────────▼─────────────┐  │
│  │ App.jsx        │  │                                 │  │ ProductService         │  │
│  │ (React UI)     │  │                                 │  │ (@Service)             │  │
│  └────────────────┘  │                                 │  └──────────┬─────────────┘  │
│                      │                                 │             │                │
└──────────────────────┘                                 │  ┌──────────▼─────────────┐  │
                                                         │  │ ProductRepository      │  │
                                                         │  │ (JpaRepository)        │  │
                                                         │  └──────────┬─────────────┘  │
                                                         │             │                │
                                                         │  ┌──────────▼─────────────┐  │
                                                         │  │ H2 In-Memory Database  │  │
                                                         │  │ (data.sql seed)        │  │
                                                         │  └────────────────────────┘  │
                                                         └──────────────────────────────┘
```

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Runtime language |
| Spring Boot | 3.2.4 | Application framework |
| Spring Data JPA | (managed) | ORM / Data access |
| Hibernate | (managed) | JPA implementation |
| H2 Database | (managed) | In-memory relational DB |
| Lombok | 1.18.34 | Boilerplate reduction |
| Maven | 3.9.6 | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI component library |
| Vite | 6.x | Dev server & bundler |
| Tailwind CSS | 4.x | Utility-first styling |


---

## Project Structure

```
albt_proj/
├── backend/                          # Spring Boot application
│   ├── pom.xml                       # Maven dependencies & build config
│   └── src/main/
│       ├── java/com/albertsons/productsearch/
│       │   ├── ProductSearchApplication.java   # Entry point (@SpringBootApplication)
│       │   ├── controller/
│       │   │   └── ProductController.java      # REST endpoints (@RestController)
│       │   ├── model/
│       │   │   └── Product.java                # JPA Entity (@Entity)
│       │   ├── repository/
│       │   │   └── ProductRepository.java      # Data access (JpaRepository)
│       │   └── service/
│       │       └── ProductService.java         # Business logic (@Service)
│       └── resources/
│           ├── application.properties          # Server & DB configuration
│           └── data.sql                        # Seed data (20 grocery products)
│
├── frontend/                         # React application
│   ├── index.html                    # HTML entry point
│   └── src/
│       ├── main.jsx                  # React DOM root mount
│       ├── App.jsx                   # Main application component
│       ├── index.css                 # Global styles
│       └── services/
│           └── ProductService.js     # API service layer (singleton)
│
├── vite.config.js                    # Vite config with API proxy
├── package.json                      # Node dependencies
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites
- **Java 17** (JDK) — [Download](https://adoptium.net/)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **Maven 3.9+** — [Download](https://maven.apache.org/)

### 1. Start the Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**. All API routes are prefixed with `/api`.

### 2. Start the Frontend (React + Vite)

```bash
# From the project root
npm install
npm run dev
```

The frontend starts on **http://localhost:3000** and automatically proxies `/api/*` requests to the backend.

### 3. Access the Application

| URL | Description |
|---|---|
| http://localhost:3000 | Frontend UI |
| http://localhost:8080/api/products | Raw JSON API |
| http://localhost:8080/api/h2-console | H2 Database Console |

**H2 Console Credentials:**
- JDBC URL: `jdbc:h2:mem:albertsons_db`
- Username: `sa`
- Password: *(leave blank)*

---

## Backend API Reference

### `GET /api/products`
Fetch all products with optional filtering and sorting.

| Query Parameter | Type | Default | Description |
|---|---|---|---|
| `query` | String | — | Search by product name (case-insensitive) |
| `department` | String | `all` | Filter by department (`produce`, `dairy`, `bakery`, `meat`, `pantry`, `beverages`, `frozen`) |
| `organic` | Boolean | `false` | Show only organic products |
| `sale` | Boolean | `false` | Show only products on sale |
| `glutenFree` | Boolean | `false` | Show only gluten-free products |
| `sortBy` | String | `relevance` | Sort order (`relevance`, `price-low`, `price-high`, `name-az`) |

**Example:**
```
GET /api/products?query=milk&department=dairy&organic=true&sortBy=price-low
```

### `GET /api/products/{id}`
Fetch a single product by ID. Returns `404` if not found.

### `POST /api/products`
Create a new product. Accepts JSON body.

**Request Body:**
```json
{
  "name": "Organic Avocados",
  "brand": "O ORGANICS",
  "category": "produce",
  "price": 2.99,
  "isOrganic": true,
  "isSale": false,
  "isGlutenFree": true,
  "size": "3 ct bag",
  "description": "Ripe organic Hass avocados"
}
```

**Response:** `201 Created` with the saved product (auto-generated `id`).

---

## Database

The application uses an **H2 in-memory database** that is automatically:
1. **Schema-created** by Hibernate based on the `Product` entity annotations (`ddl-auto=update`)
2. **Seeded** with 20 grocery products from `data.sql` on every startup

The database resets on each application restart (in-memory). Data persists only for the lifetime of the running JVM process.

---

## Frontend Details

The React frontend follows a **service-oriented architecture**:

- **`ProductService.js`** — Singleton class that encapsulates all HTTP communication with the backend. Mirrors the Spring `@Service` pattern.
- **`App.jsx`** — Single-page application with search, filters, product grid, and a shopping cart drawer.
- **Vite Proxy** — `vite.config.js` proxies all `/api/*` requests to `http://localhost:8080`, enabling seamless frontend↔backend communication during development.

---

## Design Patterns Used

| Pattern | Where | Description |
|---|---|---|
| **MVC (Model-View-Controller)** | Backend | Entity → Service → Controller layered architecture |
| **Repository Pattern** | `ProductRepository` | Data access abstracted behind `JpaRepository` interface |
| **Service Layer** | Both stacks | Business logic isolated from controllers and UI |
| **Singleton** | Frontend `ProductService` | Single instance exported, mirroring Spring's default bean scope |
| **Dependency Injection** | Backend (`@Autowired`) | Spring IoC container manages bean lifecycle |
| **DTO / Entity Mapping** | `Product.java` | JPA entity doubles as the REST response DTO |
| **Proxy Pattern** | Vite dev proxy | Frontend dev server transparently forwards API calls |

---

## Assumptions Made

During the development of this project, the following assumptions were made:
- **In-Memory Storage:** For the scope of this case study, an H2 in-memory database is sufficient for demonstration .

- **Frontend State Management:** Standard React Hooks (`useState`, `useEffect`) were deemed sufficient for the complexity of this application, avoiding over-engineering with state management libraries like Redux.

- **Data Persistence:** The application is designed to reset its data upon restart. A pre-configured `data.sql` file seeds the database so the application is immediately usable.

---

### 3. Outputs
<img width="1756" height="905" alt="Screenshot 2026-06-18 063906" src="https://github.com/user-attachments/assets/45679d0d-dd3f-46ce-a769-5c9ef664ec7f" />
 **Product Catalog View:** Displays all available grocery products with category filters, pricing information, ratings, promotional badges, and add-to-cart functionality.

<img width="1646" height="812" alt="Screenshot 2026-06-18 063943" src="https://github.com/user-attachments/assets/d91c8ec0-f31a-47ed-a7e1-2d6bcb28b931" />

  **Product Search Functionality:**  Users can search products by name. The application dynamically filters and displays matching results.

<img width="1646" height="812" alt="Screenshot 2026-06-18 063943" src="https://github.com/user-attachments/assets/a64a5045-84f2-45a9-b30d-42d048b5ef32" />

   **No Match:** When a product does not exist, the application displays a user-friendly empty state.

