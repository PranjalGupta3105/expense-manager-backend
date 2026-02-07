 ---

# 🧾 Expense Manager Backend

A GraphQL-based backend service for managing personal expenses. This project provides a structured, scalable API for creating, reading, updating, and deleting expense records using **Node.js**, **Express**, **GraphQL**, and **PostgreSQL**.

This repository contains **only the backend** — it is intended to be consumed by a frontend application or API client.

---

## 📌 Project Overview

The **Expense Manager Backend** is designed to handle expense-tracking operations through a strongly typed GraphQL API.
It focuses on clean separation of concerns by organizing schema definitions, resolvers, services, and database models into well-defined modules.

The backend can be used for:

* Personal finance tracking apps
* Expense dashboards
* Learning GraphQL backend architecture
* Serving as a foundation for a full-stack expense manager

---

## 🚀 Key Features

* GraphQL API with typed schemas
* Modular and scalable project structure
* Clear separation between resolvers and business logic
* PostgreSQL-backed persistent storage
* Easy to extend with authentication, pagination, and analytics
* Environment-based configuration support

---

## 🧱 Tech Stack

| Layer           | Technology |
| --------------- | ---------- |
| Runtime         | Node.js    |
| Server          | Express.js |
| API             | GraphQL    |
| Database        | PostgreSQL |
| Language        | JavaScript |
| Package Manager | npm        |

---

## 📁 Project Structure

```
expense-manager-backend/
├── .github/workflows/      # CI/CD workflows (if configured)
├── config/                 # Database and environment configuration
├── models/                 # Database models
├── resolvers/              # GraphQL resolver implementations
├── services/               # Core business logic
├── typeDefs/               # GraphQL schema definitions
├── constants.js            # Shared constants
├── server.js               # Application entry point
├── package.json            # Dependencies and scripts
└── .gitignore              # Ignored files
```

### Architectural Notes

* **typeDefs/** define the GraphQL schema
* **resolvers/** map schema operations to logic
* **services/** encapsulate reusable business rules
* **models/** handle database interactions

---

## 🛠 Installation & Setup

### Prerequisites

* Node.js (v14+ recommended)
* PostgreSQL
* npm

---

### Clone the Repository

```bash
git clone https://github.com/PranjalGupta3105/expense-manager-backend.git
cd expense-manager-backend
```

---

### Install Dependencies

```bash
npm install
```

---

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
PORT=4000
NODE_ENV=development
```

| Variable     | Description                   |
| ------------ | ----------------------------- |
| DATABASE_URL | PostgreSQL connection string  |
| PORT         | Port on which the server runs |
| NODE_ENV     | Application environment       |

---

### Start the Server

```bash
npm start
```

Once running, the GraphQL server will be available at:

```
http://localhost:4000/graphql
```

(GraphQL Playground or similar UI may be enabled depending on configuration.)

---

## 🚀 Usage

You can interact with the API using:

* GraphQL Playground
* Apollo Studio
* Postman / Insomnia (GraphQL mode)

### Example Query

```graphql
query {
  expenses {
    id
    amount
    category
    description
    date
  }
}
```

### Example Mutation

```graphql
mutation {
  createExpense(input: {
    amount: 500,
    category: "Food",
    description: "Dinner",
    date: "2026-02-07"
  }) {
    id
    amount
    category
  }
}
```

---

## 📦 GraphQL API Overview

### Core Types

* **Expense**

  * `id`
  * `amount`
  * `category`
  * `description`
  * `date`

### Queries

* Fetch all expenses
* Fetch a single expense by ID

### Mutations

* Create a new expense
* Update an existing expense
* Delete an expense

> Exact fields and names are defined in the `typeDefs` directory.

---

## ⚙️ Configuration

All environment-specific configuration is centralized under the `config` directory.
This allows easy extension for:

* Multiple environments (dev, test, prod)
* Logging
* Database pooling
* External services

---

## 📊 Data Model (Conceptual)

| Field       | Type   | Description          |
| ----------- | ------ | -------------------- |
| id          | ID     | Unique identifier    |
| amount      | Float  | Expense amount       |
| category    | String | Expense category     |
| description | String | Optional description |
| date        | Date   | Date of expense      |

---

## 🧪 Testing

⚠️ No automated test suite is currently included.

### Suggested Improvements

* Add Jest for unit testing
* Add resolver-level tests
* Add integration tests with a test database

---

## 🔒 Security Considerations

* Input validation should be enforced at resolver level
* Authentication and authorization are not implemented
* Query depth and complexity limits are recommended
* Sensitive environment variables must not be committed

---

## ⚠️ Limitations & Known Gaps

* No user authentication or authorization
* No pagination or filtering for large datasets
* No request validation middleware
* No database migrations included

These are intentional simplifications and can be added incrementally.

---

## 🛣 Future Improvements

* JWT-based authentication
* Expense categories and tags
* Pagination and filtering
* Analytics and reporting endpoints
* Role-based access control
* Dockerization
* CI test pipeline

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

---

## 📄 License

No license is currently specified.
Consider adding an **MIT License** or similar to clarify usage rights.

---
