# GEMINI.md

## Project Overview

This project is a RESTful API for a blogging platform. It allows users to create and manage blogs, posts, and comments. The API is built with Node.js, Express.js, and TypeScript. It uses MongoDB as its database with Mongoose as the ODM. Authentication is handled using JSON Web Tokens (JWT). The project follows a modular architecture with a clear separation of concerns for different resources like blogs, posts, users, and comments. It also includes a comprehensive test suite using Jest and Supertest.

## Building and Running

### Prerequisites

*   Node.js and pnpm
*   MongoDB

### Installation

1.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Application

1.  Start the application in development mode (with hot-reloading):
    ```bash
    pnpm run dev
    ```

2.  Build the application for production:
    ```bash
    pnpm run build
    ```

3.  Start the application in production mode:
    ```bash
    node dist/index.js
    ```

### Testing

*   Run all tests:
    ```bash
    pnpm run jest
    ```

### Linting and Formatting

*   Lint the codebase:
    ```bash
    pnpm run lint
    ```

*   Format the codebase:
    ```bash
    pnpm run format
    ```

## Development Conventions

*   **Language:** TypeScript
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose
*   **Authentication:** JWT
*   **Dependency Injection:** InversifyJS
*   **Testing:** Jest for unit and integration tests, and Supertest for E2E tests.
*   **Code Style:** The project uses ESLint and Prettier to enforce a consistent code style.
*   **Modularity:** The codebase is organized into modules for each resource (e.g., `blogs`, `posts`, `users`, `comments`). Each module has its own router, service, repository, and domain entities.
*   **Routing:** The main routing is defined in `src/setup-app.ts`. The paths for each resource are defined in `src/core/paths/paths.ts`.
*   **Configuration:** The application's configuration is managed in `src/core/settings/settings.ts`.
