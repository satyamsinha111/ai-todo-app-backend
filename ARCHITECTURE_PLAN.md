# Clean Architecture Plan for AI-Powered Todo App

## Overview
This document outlines the refactoring plan to transform the current codebase into a clean architecture pattern similar to what's used at Amazon and Google. The architecture will be organized into four main layers with clear separation of concerns.

## Clean Architecture Layers

### 1. Domain Layer (Core Business Logic)
- **Location**: `src/domain/`
- **Responsibilities**:
  - Core business entities
  - Business rules and logic
  - Interfaces for external dependencies (repositories, services)
  - Domain events and exceptions

### 2. Application Layer (Use Cases)
- **Location**: `src/application/`
- **Responsibilities**:
  - Application-specific business rules
  - Use cases/orchestrators
  - DTOs (Data Transfer Objects)
  - Application services
  - Command and Query handlers (if using CQRS)

### 3. Infrastructure Layer (External Dependencies)
- **Location**: `src/infrastructure/`
- **Responsibilities**:
  - Database implementations
  - External service integrations
  - Framework-specific code
  - Configuration
  - Logging
  - Messaging implementations

### 4. Presentation Layer (Interface Adapters)
- **Location**: `src/presentation/`
- **Responsibilities**:
  - Controllers
  - API routes
  - Middleware
  - Data mappers/presenters
  - Error handlers

## Detailed Structure

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── EmailService.ts
│   │   │   ├── TokenService.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── DomainException.ts
│   │   ├── UserNotFoundException.ts
│   │   ├── InvalidCredentialsException.ts
│   │   └── index.ts
│   └── index.ts
│
├── application/
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── RegisterUserUseCase.ts
│   │   │   ├── LoginUserUseCase.ts
│   │   │   ├── VerifyEmailUseCase.ts
│   │   │   ├── ResendVerificationUseCase.ts
│   │   │   ├── RefreshTokenUseCase.ts
│   │   │   ├── LogoutUseCase.ts
│   │   │   ├── LogoutAllDevicesUseCase.ts
│   │   │   ├── GetUserProfileUseCase.ts
│   │   │   ├── RequestPasswordResetUseCase.ts
│   │   │   ├── ResetPasswordUseCase.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── dtos/
│   │   ├── UserRegistrationDTO.ts
│   │   ├── UserLoginDTO.ts
│   │   ├── UserResponseDTO.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   └── index.ts
│   └── index.ts
│
├── infrastructure/
│   ├── persistence/
│   │   ├── repositories/
│   │   │   ├── MongoUserRepository.ts
│   │   │   └── index.ts
│   │   ├── models/
│   │   │   ├── UserDocument.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── EmailService.ts
│   │   ├── TokenService.ts
│   │   └── index.ts
│   ├── config/
│   │   ├── EnvironmentConfig.ts
│   │   └── index.ts
│   ├── database/
│   │   ├── DatabaseConnection.ts
│   │   └── index.ts
│   └── index.ts
│
├── presentation/
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── AuthMiddleware.ts
│   │   ├── ErrorMiddleware.ts
│   │   └── index.ts
│   ├── validators/
│   │   ├── AuthValidator.ts
│   │   └── index.ts
│   └── index.ts
│
└── shared/
    ├── exceptions/
    │   ├── ApplicationError.ts
    │   ├── ValidationError.ts
    │   ├── AuthenticationError.ts
    │   └── index.ts
    ├── utils/
    │   ├── Logger.ts
    │   └── index.ts
    └── index.ts
```

## Key Design Principles

1. **Dependency Rule**: Dependencies point inward. Inner layers should not depend on outer layers.

2. **Separation of Concerns**: Each layer has a specific responsibility and doesn't overlap with others.

3. **Dependency Inversion**: High-level modules don't depend on low-level modules. Both depend on abstractions.

4. **Single Responsibility**: Each class/file has one reason to change.

5. **Open/Closed Principle**: Entities are open for extension but closed for modification.

## Benefits of This Architecture

1. **Testability**: Business logic can be tested independently of frameworks and databases.
2. **Maintainability**: Changes in one layer don't affect others.
3. **Flexibility**: Easy to swap implementations (e.g., changing database from MongoDB to PostgreSQL).
4. **Scalability**: Can scale different layers independently.
5. **Framework Independence**: Business logic is not tied to specific frameworks.

## Implementation Approach

1. Start with domain layer - define entities and interfaces
2. Create application layer with use cases
3. Implement infrastructure layer with concrete implementations
4. Refactor presentation layer to use new structure
5. Update dependency injection
6. Ensure all tests pass
7. Update documentation

## Migration Strategy

1. Create new directory structure alongside existing code
2. Gradually migrate components from old structure to new structure
3. Maintain backward compatibility during migration
4. Update imports and references
5. Remove old structure once migration is complete

## Implementation Status

✅ **Completed**: The clean architecture refactoring has been successfully implemented following the plan outlined above.

### What Was Accomplished

1. **Domain Layer**: Created entities, interfaces, and exceptions in `src/domain/`
2. **Application Layer**: Implemented use cases and services in `src/application/`
3. **Infrastructure Layer**: Built repository implementations, services, and configuration in `src/infrastructure/`
4. **Presentation Layer**: Refactored controllers, routes, and middleware in `src/presentation/`
5. **Dependency Injection**: Created a container in `src/dependency-injection/` to manage component wiring
6. **Integration**: Updated the main application (`src/app.ts`) to use the new architecture

### Benefits Achieved

- **Modularity**: Code is now organized into distinct layers with clear responsibilities
- **Testability**: Business logic can be tested independently of frameworks and databases
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Easy to swap implementations (e.g., changing database from MongoDB to PostgreSQL)
- **Scalability**: Can scale different layers independently
- **Framework Independence**: Business logic is not tied to specific frameworks

The refactoring has been completed while maintaining all existing functionality and ensuring backward compatibility where necessary.