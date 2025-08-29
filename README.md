# QA Playwright

A monorepo for automated QA testing using Playwright.

## Project Structure

```
├── apps/
│   ├── web/            # Web application (to be implemented)
│   └── worker/         # Playwright test worker
├── infra/
│   ├── docker/         # Docker configuration
│   └── prisma/         # Database schema and client
└── packages/
    └── shared/         # Shared types and utilities
```

## Database Schema

```
User
  ├── id
  ├── email
  ├── name
  └── projects (relation)

Project
  ├── id
  ├── name
  ├── userId (relation)
  └── targets (relation)

Target
  ├── id
  ├── name
  ├── url
  └── projectId (relation)
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
cd infra/prisma && npx prisma generate

# Build all packages
npx turbo run build
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/qa_playwright
```

### Running the Worker

```bash
cd apps/worker && pnpm run start
```

## Features

- Automated testing of web applications using Playwright
- Test templates for common scenarios (basic page checks, login flows)
- Database storage of test targets and results
- Scalable worker architecture