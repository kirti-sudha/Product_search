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



1. **User Interaction**: The user performs an action in the UI (e.g., types "milk", clicks "Organic", or changes sort to "Price: Low to High").
2. **State Syncing**: `App.jsx` handles state changes via React's `useState` hooks.
3. **API Call Execution**: A single service class (`ProductService.js`) builds the query parameters and sends an HTTP fetch request to `/api/products?query=...`.
4. **Vite Proxy Redirection**: The request is captured by the Vite Dev Server and proxied to `http://localhost:8080/api/products`.
5. **REST Controller Dispatch**: The Spring Boot `@RestController` intercepts the query and extracts the parameters.
6. **Service Layer Processing**: The service layer coordinates the query logic, calling `ProductRepository` to search by name/department and refining the stream (applying organic, gluten-free, or sale filters and sorting.
7. **JPA Database Retrieval**: The repository layer executes H2 SQL queries, map records to JPA `Product` entities, and transfers them back up the stack.
8. **JSON Serialization**: The controller wraps the entities in a `ResponseEntity` which Spring Boot automatically serializes to JSON via Jackson.
9. **UI Rendering**: The client receives the JSON payload, updates the list state, and re-renders the responsive grid with micro-animations.
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
---
```



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
* **Example JSON Response**:
  ```json
  [
    {
      "id": "prod-3",
      "name": "Lucerne Whole Milk",
      "brand": "LUCERNE",
      "category": "dairy",
      "price": 3.49,
      "originalPrice": 4.19,
      "rating": 4.9,
      "reviewsCount": 844,
      "isOrganic": false,
      "isSale": true,
      "size": "1 Gallon",
      "isGlutenFree": true,
      "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150",
      "description": "Lucerne Whole Milk, Vitamin D fortified, fine pasteurized quality.",
      "deptId": "dairy"
    }
  ]
  ```

### `GET /api/products/{id}`
Fetches details for a single product matching the path identifier.
* **Success Response**: `200 OK` with JSON object.
* **Error Response**: `404 Not Found` if the ID does not map to a product.

### `POST /api/products`
Create a new product. Accepts JSON body.

### `POST /api/products`
Creates a new product record in the database.
* **Content-Type**: `application/json`
* **JSON Body Schema**:
  ```json
  {
    "name": "Fresh Organic Blueberries",
    "brand": "O ORGANICS",
    "category": "produce",
    "price": 4.99,
    "isOrganic": true,
    "isSale": false,
    "isGlutenFree": true,
    "size": "11 oz",
    "description": "Fresh premium sweet organic blueberries."
  }
  ```
* **Defaults Handled**: If `id` is empty, the system generates a unique ID on creation. If `deptId` is omitted, it auto-assigns the value from `category`. Default ratings (5.0) and reviews (1) are populated if not provided.
* **Success Response**: `201 Created` with the saved entity payload.
---

### Database Properties
The backend utilizes an **H2 database engine** configured to run completely in-memory. 
* **Persistence**: Data exists in-memory and will reset completely when the Spring Boot JVM process is restarted.
* **Schema Generation**: Automatically managed by Hibernate ORM (`ddl-auto=update`), mapping annotations in `Product.java` directly to SQL schema fields on startup.
* **Data Seeding**: A SQL script `data.sql` executes immediately after schema creation, populating the database with 20 grocery products across various departments (produce, dairy, bakery, meat, pantry, beverages, frozen).
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
| **Entity Mapping** | `Product.java` | JPA entity doubles as the REST response DTO |
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

  **Product Catalog View:**  Displays all available grocery products with category filters, pricing information, ratings, promotional badges, and add-to-cart functionality.

<img width="1646" height="812" alt="Screenshot 2026-06-18 063943" src="https://github.com/user-attachments/assets/d91c8ec0-f31a-47ed-a7e1-2d6bcb28b931" />

  **Product Search Functionality:**  Users can search products by name. The application dynamically filters and displays matching results.

<img width="1623" height="835" alt="Screenshot 2026-06-18 064013" src="https://github.com/user-attachments/assets/e0777e74-f783-43ef-82bf-a61769c0e8d6" />

   **No Match:** When a product does not exist, the application displays a user-friendly empty state.
---


## AI tools used And challenges faced in the project

This project was developed with help of AI tools - Claude Opus and Google Gemini 3.5 . The AI acted as a pair-programmer
throughout the development lifecycle, accelerating development, and system integration. They contributed to the following phases:
Generating Spring Boot initializers, REST controller endpoints, database repository interfaces, and data models with precise JPA
mappings. Client-Side Architecture, creating a clean Service-layer structure mirroring the backend architecture. 
Bridge Configuration: Designing the Vite configuration proxy rules to intercept front-end `/api` routing calls and transparently
direct them to Tomcat (port 8080), avoiding CORS (Cross-Origin Resource Sharing) restrictions without complicating
deployment environments. 

Technical challenges were encountered and successfully resolved:
1. Database Schema and Seeding Sync Order:
Early in backend deployment, the application threw exceptions on startup when executing `data.sql` to insert the 20 initial grocery
items. This happened because Spring Boot, by default, executed data seeding scripts before Hibernate had completed scanning
class annotations and creating the underlying database tables. Resolution: The property `spring.jpa.defer-datasource-initialization=true` was explicitly enabled in `application.properties`. This
tells the framework to defer database seeding until Hibernate has compiled the schema, ensuring a clean startup sequence. 2. Lombok Bytecode Incompatibility
Resolution: A compatible JDK 17 was used. This bypassed any compiler-level bytecode conflicts, making the backend highly
robust and compile-safe on any standard Java runtime.

---

