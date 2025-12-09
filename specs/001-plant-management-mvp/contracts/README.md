# API Contracts

This directory contains OpenAPI 3.0 specifications for all DrPlantes MVP API endpoints.

## Contract Files

- **[auth.yaml](./auth.yaml)** - Authentication and user management endpoints
- **plants.yaml** - Plant registry CRUD operations (to be generated)
- **species.yaml** - Plant species and FAQ endpoints (to be generated)
- **schedules.yaml** - Watering schedules and events (to be generated)
- **admin.yaml** - Administrator functions (to be generated)

## API Structure

### Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.drplantes.com/api/v1`

### Authentication
All protected endpoints require Bearer token authentication:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoint Summary

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/reset-password` - Request password reset
- `POST /auth/reset-password/confirm` - Confirm password reset

#### User Profile (`/users`)
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile
- `DELETE /users/me` - Delete account
- `GET /users/me/export` - Export user data (GDPR)

#### Plants (`/plants`)
- `GET /plants` - List user's plants
- `POST /plants` - Create new plant
- `GET /plants/:id` - Get plant details
- `PUT /plants/:id` - Update plant
- `DELETE /plants/:id` - Delete plant
- `POST /plants/:id/photos` - Upload plant photo
- `DELETE /plants/:id/photos/:photoId` - Delete plant photo

#### Plant Species (`/species`)
- `GET /species` - List all species (paginated)
- `POST /species` - Create species (expert/admin only)
- `GET /species/:id` - Get species details with FAQs
- `PUT /species/:id` - Update species (expert/admin only)
- `GET /species/search` - Search species by name
- `POST /species/:id/faqs` - Add FAQ (expert/admin only)
- `PUT /species/:id/faqs/:faqId` - Update FAQ (expert/admin only)
- `DELETE /species/:id/faqs/:faqId` - Delete FAQ (expert/admin only)

#### Watering Schedules (`/schedules`)
- `GET /schedules` - List user's schedules
- `POST /schedules` - Create schedule for plant
- `GET /schedules/:id` - Get schedule details
- `PUT /schedules/:id` - Update schedule
- `DELETE /schedules/:id` - Delete schedule
- `POST /schedules/:id/water` - Mark plant as watered
- `POST /schedules/:id/snooze` - Snooze watering reminder
- `GET /schedules/:id/history` - Get watering history
- `GET /schedules/calendar` - Get watering calendar view

#### Admin (`/admin`)
- `GET /admin/users` - List all users (admin only)
- `PUT /admin/users/:id/role` - Change user role (admin only)
- `PUT /admin/users/:id/deactivate` - Deactivate user (admin only)
- `GET /admin/stats` - Platform statistics (admin only)

### Response Formats

#### Success Response
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Plant name is required"
    }
  ],
  "timestamp": "2025-12-07T10:00:00.000Z",
  "path": "/api/v1/plants"
}
```

### HTTP Status Codes

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

### Pagination

List endpoints support pagination via query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Example: `GET /api/v1/plants?page=2&limit=20`

### Filtering & Sorting

- `sort` - Sort field and direction (e.g., `sort=createdAt:desc`)
- `filter` - Filter by field (e.g., `filter[location]=Living Room`)

### Validation Rules

All request bodies are validated. Common validation rules:
- Email: Valid RFC 5322 format
- Password: Minimum 8 characters
- UUIDs: Valid UUID v4 format
- Dates: ISO 8601 format
- String lengths: Enforced per field (see schemas)

## Generating TypeScript Types

Use `openapi-typescript` to generate TypeScript types from these contracts:

```bash
npx openapi-typescript ./contracts/auth.yaml -o ../shared/types/auth.ts
```

## Testing Contracts

Use Supertest for contract testing:

```typescript
describe('POST /auth/register', () => {
  it('should match OpenAPI schema', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');
  });
});
```

## Next Steps

1. Complete remaining contract files (plants, species, schedules, admin)
2. Validate contracts with OpenAPI validator
3. Generate TypeScript types for frontend
4. Implement contract tests in backend
5. Set up Swagger UI for API documentation
