# Quick Start Guide - Authentication

## Setup

1. Ensure environment variables are configured in `.env`:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

2. Start the development server:
   ```bash
   npm run start:dev
   ```

3. Access API documentation:
   ```
   http://localhost:3000/api/docs
   ```

## Quick Test Flow

### 1. Register a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

### 3. Access Protected Endpoint

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response:**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "name": "Test User",
  "role": "user"
}
```

## Using in Your Code

### Protect a Route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('my-resource')
export class MyResourceController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  getProtectedData() {
    return { message: 'This is protected!' };
  }
}
```

### Get Current User

```typescript
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Controller('my-resource')
export class MyResourceController {
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMyData(@Req() request: AuthRequest) {
    const userId = request.user.id;
    const userEmail = request.user.email;
    return { userId, userEmail };
  }
}
```

### Use Hash Service

```typescript
import { Injectable } from '@nestjs/common';
import { HashService } from '../common/services/hash.service';

@Injectable()
export class MyService {
  constructor(private hashService: HashService) {}

  async changePassword(oldPassword: string, newPassword: string) {
    // Hash new password
    const hashedPassword = await this.hashService.hashPassword(newPassword);

    // Compare old password
    const isValid = await this.hashService.comparePassword(
      oldPassword,
      storedHash
    );

    return { hashedPassword, isValid };
  }
}
```

## Validation Rules

### RegisterDto
- **email**: Must be valid email format
- **password**: Minimum 8 characters
- **name**: Minimum 2 characters

### LoginDto
- **email**: Must be valid email format
- **password**: Required (no minimum on login)

## Common Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

## JWT Token Format

The JWT payload contains:
```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## File Locations

- DTOs: `/src/auth/dto/`
- Services: `/src/auth/auth.service.ts`, `/src/users/users.service.ts`
- Controllers: `/src/auth/auth.controller.ts`, `/src/users/users.controller.ts`
- Guards: `/src/auth/guards/jwt-auth.guard.ts`
- Strategies: `/src/auth/strategies/jwt.strategy.ts`
- Hash Service: `/src/common/services/hash.service.ts`

## Tips

1. Always use `@UseGuards(JwtAuthGuard)` on protected routes
2. Add `@ApiBearerAuth('JWT-auth')` for Swagger documentation
3. Access user info via `@Req() request` parameter
4. Password field is automatically excluded from all responses
5. Tokens expire based on `JWT_EXPIRES_IN` environment variable
6. Use Swagger UI for easy testing during development
