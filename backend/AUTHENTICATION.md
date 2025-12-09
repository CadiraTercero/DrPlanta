# DrPlantes Authentication System

## Overview

This authentication system implements JWT-based authentication using NestJS v11, Passport, and bcrypt for password hashing. The system provides user registration, login, and profile management functionality.

## Architecture

### Components

#### 1. Authentication DTOs (`/src/auth/dto/`)

- **RegisterDto** (`register.dto.ts`)
  - Validates user registration data
  - Fields: email (email validation), password (min 8 chars), name (min 2 chars)

- **LoginDto** (`login.dto.ts`)
  - Validates login credentials
  - Fields: email (email validation), password

- **AuthResponseDto** (`auth-response.dto.ts`)
  - Response format for authentication operations
  - Contains: access_token (JWT) and user object (id, email, name, role)

#### 2. Password Hashing Service (`/src/common/services/hash.service.ts`)

- Uses bcrypt with 10 salt rounds
- Methods:
  - `hashPassword(password: string)`: Hashes a plain text password
  - `comparePassword(password: string, hash: string)`: Compares password with hash

#### 3. JWT Strategy (`/src/auth/strategies/jwt.strategy.ts`)

- Extends PassportStrategy using 'jwt'
- Extracts JWT from Authorization Bearer token
- Secret configured via `JWT_SECRET` environment variable
- Validates JWT payload and returns user information

#### 4. JWT Auth Guard (`/src/auth/guards/jwt-auth.guard.ts`)

- Extends AuthGuard('jwt') from Passport
- Protects routes requiring authentication
- Usage: `@UseGuards(JwtAuthGuard)`

#### 5. Auth Service (`/src/auth/auth.service.ts`)

Core authentication business logic:

- `register(registerDto)`:
  - Validates email uniqueness
  - Hashes password
  - Creates user record
  - Returns JWT token and user data

- `login(loginDto)`:
  - Finds user by email
  - Validates password
  - Generates JWT token
  - Returns token and user data

- `validateUser(email, password)`:
  - Validates user credentials
  - Returns user without password field

#### 6. Auth Controller (`/src/auth/auth.controller.ts`)

REST API endpoints:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

Both endpoints return AuthResponseDto with access token and user information.

#### 7. Users Service (`/src/users/users.service.ts`)

User management operations:

- `findById(id)`: Retrieves user by ID (excludes password)
- `findByEmail(email)`: Retrieves user by email (excludes password)
- `update(id, updateData)`: Updates user information

#### 8. Users Controller (`/src/users/users.controller.ts`)

User-related endpoints:

- `GET /api/v1/users/profile` - Get current user profile (protected)
  - Requires JWT authentication
  - Returns current user data from token

## Environment Variables

Required environment variables (see `.env.example`):

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## API Documentation

### Register User

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists

### Login User

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid credentials

### Get User Profile

**Endpoint:** `GET /api/v1/users/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token

## Usage Examples

### Protecting Routes with JWT Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  getProtectedResource() {
    return { message: 'This is protected' };
  }
}
```

### Accessing Current User in Controller

```typescript
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('me')
export class MeController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() request: any) {
    // request.user contains: { id, email, name, role }
    return request.user;
  }
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Stateless authentication using signed JWT tokens
3. **Token Expiration**: Tokens expire after configured period (default: 7 days)
4. **Input Validation**: All DTOs use class-validator for input validation
5. **Password Exclusion**: Password fields are never included in API responses
6. **Email Uniqueness**: Email addresses must be unique across users

## Module Structure

```
backend/src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   ├── auth-response.dto.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── index.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── index.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── common/
    └── services/
        ├── hash.service.ts
        └── index.ts
```

## Testing with Swagger

Access the Swagger documentation at: `http://localhost:3000/api/docs`

1. Register a new user via `/api/v1/auth/register`
2. Login via `/api/v1/auth/login` and copy the `access_token`
3. Click the "Authorize" button in Swagger UI
4. Enter the token in format: `Bearer <your-token>`
5. Now you can access protected endpoints like `/api/v1/users/profile`

## Next Steps

Consider implementing:

1. Refresh token mechanism for long-lived sessions
2. Password reset functionality via email
3. Email verification on registration
4. Two-factor authentication (2FA)
5. Role-based access control (RBAC) with guards
6. Account lockout after failed login attempts
7. OAuth2 integration (Google, GitHub, etc.)
