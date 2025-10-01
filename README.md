# Rentalux

A modern vehicle rental platform built with a serverless architecture, featuring real-time reservation management, secure payment processing, and an intuitive user interface.

## Overview

Rentalux is a full-stack vehicle rental application that allows customers to browse available vehicles, make reservations, and complete payments securely. The platform includes an admin dashboard for managing vehicles and monitoring reservations in real-time.

## Key Features

- **Vehicle Browsing**: Browse a catalog of available rental vehicles with detailed information and images
- **Reservation Management**: Create, update, and cancel reservations with real-time availability checking
- **Secure Payments**: Stripe integration for secure payment processing with webhook support
- **User Authentication**: Clerk-based authentication with role-based access control
- **Admin Dashboard**: Manage vehicle inventory and view all reservations
- **Customer Portal**: View personal reservation history and upcoming bookings
- **Responsive Design**: Modern UI built with Next.js, Tailwind CSS, and Radix UI components
- **Caching**: Intelligent caching layer for improved performance on reservation queries

## Technology Stack

### Frontend
- **Next.js 13** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Clerk** - Authentication and user management
- **Stripe.js** - Payment processing

### Backend
- **Spring Boot 2.6** - Java application framework
- **AWS Lambda** - Serverless reservation service
- **DynamoDB** - NoSQL database for vehicles and reservations
- **Caffeine** - In-memory caching
- **Dagger 2** - Dependency injection for Lambda functions

### Infrastructure
- **AWS CloudFormation** - Infrastructure as code
- **AWS API Gateway** - REST API management
- **AWS S3** - Static asset storage
- **Redis** - Session management (local development)

## Architecture

Rentalux uses a hybrid architecture combining a Spring Boot application server with AWS Lambda microservices:

1. **Application Server** (Spring Boot):
   - Serves the REST API for vehicle operations
   - Manages vehicle inventory in DynamoDB
   - Integrates with Lambda service for reservation operations
   - Implements caching layer for performance optimization

2. **Lambda Service**:
   - Handles all reservation CRUD operations
   - Stores reservation data in dedicated DynamoDB table
   - Supports querying by vehicle ID or customer ID
   - Scales automatically based on demand

3. **Frontend** (Next.js):
   - Server-side rendered pages for SEO optimization
   - Protected routes with Clerk authentication
   - Stripe checkout integration
   - Real-time reservation updates

## Getting Started

### Prerequisites

- Java 11 or higher
- Node.js 18 or higher
- AWS CLI configured with appropriate credentials
- Docker (for local DynamoDB and Redis)

### Environment Setup

1. Configure your environment variables:
```bash
source ./setupEnvironment.sh
```

2. Update `setupEnvironment.sh` with your details:
   - `CAPSTONE_REPO_NAME`: Your GitHub repository name
   - `GITHUB_GROUP_NAME`: Your team/group name

### Local Development

#### Backend
```bash
# Start local DynamoDB
./local-dynamodb.sh

# Start local Redis
./runLocalRedis.sh

# Run Spring Boot application with hot reload
./gradlew bootRunDev
```

The backend API will be available at `http://localhost:8080`

#### Frontend
```bash
cd FrontendNextJs

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# - Clerk API keys
# - Stripe API keys
# - Backend API URL

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Testing

```bash
# Run all unit tests
./gradlew test

# Run integration tests
./gradlew :IntegrationTests:test

# Run specific module tests
./gradlew :Application:test
./gradlew :ServiceLambda:test
```

## Deployment

### Development Environment

Deploy to AWS development environment:
```bash
./deployDev.sh
```

Teardown development environment:
```bash
./cleanupDev.sh
```

### CI/CD Pipeline

Create automated deployment pipeline:
```bash
./createPipeline.sh
```

Remove pipeline:
```bash
./cleanupPipeline.sh
```

## API Documentation

Once the application is running, API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui/`
- OpenAPI Spec: `http://localhost:8080/v3/api-docs`

### Key Endpoints

- `GET /rental/all` - List all vehicles
- `GET /rental/{id}` - Get vehicle details with reservations
- `POST /rental` - Add new vehicle (admin)
- `POST /rental/reservation` - Create reservation
- `PUT /rental/reservation/{id}` - Update reservation
- `DELETE /rental/reservation/{id}` - Cancel reservation
- `GET /rental/reservation/customer/{id}` - Get customer reservations
- `GET /rental/reservation/all` - Get all reservations (admin)

## Payment Integration

Rentalux uses Stripe for payment processing:

1. Customer selects vehicle and dates
2. Creates reservation with `payed: false`
3. Redirected to Stripe checkout
4. Webhook confirms payment and updates reservation
5. Once paid, reservations cannot be modified by customers

## Project Structure

```
Rentalux/
├── Application/           # Spring Boot REST API
├── ServiceLambda/         # AWS Lambda reservation service
├── ServiceLambdaModel/    # Shared data models
├── ServiceLambdaJavaClient/  # Lambda client library
├── FrontendNextJs/        # Next.js frontend application
├── IntegrationTests/      # End-to-end integration tests
├── Utilities/             # Shared utilities and configs
└── buildSrc/              # Gradle build conventions
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `./gradlew test`
4. Submit a pull request

## License

This project was developed as part of the Kenzie Academy capstone program.
