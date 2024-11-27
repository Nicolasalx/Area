# Available Commands

Below is a list of available commands in this project, along with their descriptions.

## General Commands

| Command             | Description                                                 |
|---------------------|-------------------------------------------------------------|
| `npm run build`     | Compiles the project using the NestJS compiler.             |
| `npm run start`     | Starts the application in production mode.                  |
| `npm run start:dev` | Starts the application in development mode with hot reload. |
| `npm run start:debug` | Starts the application in debug mode with hot reload.     |
| `npm run start:prod` | Runs the compiled project in production mode.              |

## Development Commands

| Command             | Description                                                 |
|---------------------|-------------------------------------------------------------|
| `npm run format`    | Formats the code using Prettier.                            |
| `npm run lint`      | Lints the code with ESLint and fixes any issues found.      |
| `npm run test`      | Runs all tests using Jest.                                  |
| `npm run test:watch` | Runs tests and watches for changes.                        |
| `npm run test:cov`  | Runs tests and generates a coverage report.                 |
| `npm run test:debug` | Runs tests in debug mode.                                  |
| `npm run test:e2e`  | Executes end-to-end (E2E) tests.                            |

## Database Commands

| Command             | Description                                                 |
|---------------------|-------------------------------------------------------------|
| `npm run db:up`     | Starts the database services using Docker Compose.          |
| `npm run db:down`   | Stops the database services using Docker Compose.           |
| `npm run db:update` | Generates Prisma files and applies migrations.              |
| `npm run db:view`   | Opens Prisma Studio to view and manage data.                |

## Additional Information

### Tools Used
- **Prisma**: Database management tool.
- **Prettier**: Code formatter.
- **ESLint**: Static code analysis tool.
- **Jest**: Testing framework.

### Jest Configuration
Tests are configured to target files matching the pattern `*.spec.ts` in the `src` directory.
