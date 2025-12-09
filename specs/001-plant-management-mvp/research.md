# Research & Technology Decisions: Plant Management MVP

**Date**: 2025-12-07
**Feature**: Plant Management MVP
**Plan**: [plan.md](./plan.md)

## Overview

This document captures the research findings, technology decisions, and architectural patterns for implementing the Plant Management MVP. All decisions align with the constitution principles and support the requirements defined in the specification.

## Technology Stack Decisions

### Backend Framework: NestJS

**Decision**: Use NestJS as the backend framework

**Rationale**:
- Built-in TypeScript support with decorators for clean, type-safe code
- Dependency injection system simplifies testing and modularity
- Excellent support for role-based guards (critical for FR-004)
- Native OpenAPI/Swagger documentation generation
- Structured module system aligns with our domain (auth, plants, species, schedules)
- Active community and extensive documentation
- Built on Express, familiar to Node.js developers

**Alternatives Considered**:
- **Express.js**: More lightweight but requires manual setup for DI, guards, and validation
- **Fastify**: Faster but less mature ecosystem for TypeScript/DI patterns
- **tRPC**: Type-safe but ties frontend too tightly to backend (violates API-first principle)

**Best Practices**:
- Use `@nestjs/config` for environment variable management
- Implement global exception filters for consistent error responses
- Use `class-validator` and `class-transformer` for DTO validation
- Separate business logic into services, keep controllers thin
- Use TypeORM repositories for database access

### Database & ORM: PostgreSQL + TypeORM

**Decision**: PostgreSQL 14+ with TypeORM

**Rationale**:
- PostgreSQL: Robust ACID guarantees, JSON support for flexible fields, excellent performance
- TypeORM: TypeScript-first ORM, decorator-based entities, migration system, NestJS integration
- Relational structure fits our data model (users, plants, species with clear relationships)
- Strong support for complex queries (filtering plants, searching species)
- JSON columns useful for flexible plant care instructions

**Alternatives Considered**:
- **MongoDB**: NoSQL flexibility but loses referential integrity (critical for user-plant relationships)
- **Prisma**: Modern ORM but TypeORM has better NestJS integration and maturity
- **Sequelize**: Mature but less TypeScript-friendly

**Best Practices**:
- Use migrations for schema changes (never sync in production)
- Index foreign keys and frequently queried fields (user_id, species_id)
- Use UUIDs for primary keys (better distribution, security)
- Implement soft deletes for users (FR-037), hard deletes for plants
- Use transactions for multi-table operations (creating plant + schedule)

### Authentication: JWT with Passport

**Decision**: JWT tokens with Passport.js strategies

**Rationale**:
- Stateless authentication scales well (no session storage needed)
- NestJS has excellent `@nestjs/passport` integration
- Supports multiple strategies (local for email/password, JWT for API requests)
- Token expiration aligns with requirements (7 days mobile, 24 hours web)
- Role information embedded in token payload for efficient authorization

**Alternatives Considered**:
- **Session-based auth**: Requires Redis/session store, adds complexity
- **OAuth2**: Overkill for MVP, adds external dependencies
- **Auth0/Clerk**: Managed services but add cost and external dependency

**Best Practices**:
- Use bcrypt with salt rounds 10-12 for password hashing
- Refresh token strategy for mobile (store securely in keychain/keystore)
- Include user ID and role in JWT payload
- Implement `@nestjs/jwt` guards for protected routes
- Rate-limit login endpoints to prevent brute force

### Mobile Framework: React Native + Expo

**Decision**: React Native with Expo SDK

**Rationale**:
- Expo provides managed workflow: easier setup, OTA updates, push notifications built-in
- React Native Paper for Material Design UI components (consistent, accessible)
- React Navigation for routing (standard, well-documented)
- Expo Go for rapid development and testing
- AsyncStorage for offline data caching (FR-006 requirement)
- Expo Notifications API for watering reminders

**Alternatives Considered**:
- **Flutter**: Different language (Dart), less JavaScript ecosystem sharing
- **Bare React Native**: More control but requires native module setup (Xcode, Android Studio)
- **Ionic/Capacitor**: Web-based, less native feel

**Best Practices**:
- Use React Context API for auth state (simpler than Redux for MVP)
- Implement offline-first data layer with AsyncStorage
- Use `react-query` for API caching and synchronization
- Optimize images with Expo Image component
- Use Expo SecureStore for sensitive data (JWT tokens)
- Implement pull-to-refresh for plant lists

### Web Framework: React + Vite

**Decision**: React 18 with Vite build tool

**Rationale**:
- Vite provides instant HMR and fast builds (better DX than Create React App)
- React 18 with concurrent features for smooth UX
- Vite optimizes bundle size automatically
- Easy deployment to Vercel/Netlify
- TypeScript support out of the box

**Alternatives Considered**:
- **Next.js**: SSR overkill for MVP, adds complexity
- **Create React App**: Slower builds, being phased out
- **Remix**: New framework, less mature ecosystem

**Best Practices**:
- Use React Router v6 for client-side routing
- Implement code splitting by route
- Use Material-UI or Tailwind CSS for consistent design system
- Share API client code with mobile via npm workspace or shared folder
- Implement error boundaries for graceful error handling
- Use Suspense for lazy-loaded components

### File Storage: Cloudinary

**Decision**: Cloudinary for image storage and transformation

**Rationale**:
- Automatic image optimization and responsive delivery
- Free tier supports MVP scale (25 GB storage, 25 GB bandwidth)
- Built-in transformations (thumbnails, compression)
- Direct upload from client with signed URLs
- CDN distribution for fast global access
- Node.js SDK for backend integration

**Alternatives Considered**:
- **AWS S3**: More setup required, need CloudFront for CDN
- **Firebase Storage**: Good but ties us to Firebase ecosystem
- **Local storage**: Doesn't scale, no CDN, backup complexity

**Best Practices**:
- Use signed upload URLs from backend (security)
- Generate thumbnails on upload (150x150 for lists, 800x800 for details)
- Limit file size at API level (10MB max per FR-042)
- Store Cloudinary public_id in database, not full URL
- Implement lazy loading for images in lists

### Notification Service: Expo Push Notifications

**Decision**: Expo Push Notification service for mobile

**Rationale**:
- Integrated with Expo, no additional setup
- Handles both iOS (APNS) and Android (FCM) automatically
- Free for reasonable usage
- Simple API for sending notifications from backend
- Supports scheduled notifications

**Alternatives Considered**:
- **Firebase Cloud Messaging**: Requires bare React Native workflow
- **OneSignal**: Third-party service, adds external dependency
- **Native APNS/FCM**: Complex setup, need to handle both platforms

**Best Practices**:
- Store Expo push tokens in user table
- Implement background job (node-cron) for daily notification processing
- Queue notifications with Bull for reliability
- Allow users to configure notification preferences
- Handle notification errors gracefully (invalid tokens, etc.)
- Implement notification batching to avoid rate limits

##

 Background Jobs & Scheduling

**Decision**: node-cron + Bull queue

**Rationale**:
- node-cron for simple scheduling (daily watering check)
- Bull (Redis-based) for reliable job processing
- Handles notification delivery with retries
- Scales horizontally if needed

**Alternatives Considered**:
- **Agenda**: MongoDB-based but we use PostgreSQL
- **AWS EventBridge**: Cloud service, adds cost and complexity

**Best Practices**:
- Run watering check job daily at 8 AM user local time
- Use Bull for notification queue (retry 3 times on failure)
- Monitor job failures with logging
- Implement job cleanup to prevent queue buildup

## Architectural Patterns

### API Design: RESTful with Versioning

**Pattern**: RESTful API with URL versioning (`/api/v1/`)

**Rationale**:
- Standard, well-understood by developers
- Easy to version as requirements evolve
- Works well with OpenAPI documentation
- Supports all CRUD operations needed

**Endpoints Structure**:
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/reset-password

GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
GET    /api/v1/users/me/export

GET    /api/v1/plants
POST   /api/v1/plants
GET    /api/v1/plants/:id
PUT    /api/v1/plants/:id
DELETE /api/v1/plants/:id
POST   /api/v1/plants/:id/photos
DELETE /api/v1/plants/:id/photos/:photoId

GET    /api/v1/species
POST   /api/v1/species (expert only)
GET    /api/v1/species/:id
PUT    /api/v1/species/:id (expert only)
GET    /api/v1/species/search?q=monstera

POST   /api/v1/schedules
GET    /api/v1/schedules
PUT    /api/v1/schedules/:id
POST   /api/v1/schedules/:id/water
GET    /api/v1/schedules/:id/history
GET    /api/v1/schedules/calendar

GET    /api/v1/admin/users (admin only)
PUT    /api/v1/admin/users/:id/role (admin only)
GET    /api/v1/admin/stats (admin only)
```

### Error Handling: Consistent JSON Responses

**Pattern**: Standardized error response format

```typescript
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

**Best Practices**:
- Use NestJS exception filters for global error handling
- Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- Include validation errors in structured format
- Log all 500 errors for debugging
- Never expose sensitive data in error messages

### Authorization: Role-Based Access Control (RBAC)

**Pattern**: NestJS guards with role decorators

```typescript
@Controller('species')
@UseGuards(JwtAuthGuard)
export class SpeciesController {
  @Post()
  @Roles('expert', 'admin')
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateSpeciesDto) {
    // Only experts and admins can create species
  }

  @Get()
  findAll() {
    // All authenticated users can view species
  }
}
```

**Best Practices**:
- Always use guards at controller level (never trust client)
- Include role in JWT payload for efficiency
- Implement custom `@Roles()` decorator
- Log authorization failures for security monitoring
- Use ownership checks for user-specific resources (e.g., user can only edit their own plants)

### Data Validation: DTOs with Class Validator

**Pattern**: Data Transfer Objects with validation decorators

```typescript
export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsUUID()
  speciesId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsDateString()
  acquisitionDate?: string;
}
```

**Best Practices**:
- Validate all incoming data at API boundary
- Use `ValidationPipe` globally in NestJS
- Return detailed validation errors to client
- Use separate DTOs for create/update operations
- Sanitize user inputs to prevent XSS/injection

### Offline Support: Cache-First Strategy (Mobile)

**Pattern**: AsyncStorage cache with background sync

**Strategy**:
1. On app load: Read from AsyncStorage, display immediately
2. Background: Fetch from API, update cache if changed
3. On user action: Optimistic update to cache, sync to API
4. On API failure: Keep local changes, retry later

**Implementation**:
```typescript
// Fetch plants with offline support
const fetchPlants = async () => {
  // 1. Load from cache immediately
  const cached = await AsyncStorage.getItem('plants');
  if (cached) setPlants(JSON.parse(cached));

  // 2. Fetch from API in background
  try {
    const response = await api.get('/plants');
    setPlants(response.data);
    await AsyncStorage.setItem('plants', JSON.stringify(response.data));
  } catch (error) {
    // Use cached data, show offline indicator
    setIsOffline(true);
  }
};
```

**Best Practices**:
- Cache plant list and species data (read-heavy)
- Don't cache sensitive data (auth tokens use SecureStore)
- Implement cache expiration (refresh after 24 hours)
- Show offline indicator when API unavailable
- Queue write operations for retry when back online

## Security Considerations

### Password Security
- Use bcrypt with salt rounds 10-12
- Enforce minimum password length (8 characters)
- Implement password reset with time-limited tokens
- Never log or expose passwords

### JWT Security
- Short expiration for web (24 hours), longer for mobile with refresh (7 days)
- Store JWT securely (SecureStore on mobile, httpOnly cookies on web)
- Include `jti` claim for token revocation if needed
- Validate token signature and expiration on every request

### API Security
- Rate limiting on auth endpoints (10 requests/minute)
- CORS configuration for web app domain only
- Helmet.js for security headers
- Input sanitization to prevent XSS and SQL injection
- File upload validation (type, size, malware scanning if possible)

### Data Privacy (GDPR)
- Implement data export (FR-039)
- Implement account deletion with data purge
- Store user consent timestamps
- Encrypt sensitive data at rest (consider database encryption)
- Log access to personal data for audit

## Performance Optimizations

### Database
- Index foreign keys and search fields
- Use pagination for list endpoints (20 items per page default)
- Implement database connection pooling
- Use database read replicas for scaling (post-MVP)

### API
- Implement response caching for read-heavy endpoints (species data)
- Use ETags for conditional requests
- Compress responses with gzip
- Implement API response pagination

### Frontend
- Lazy load images with placeholders
- Implement infinite scroll for plant lists
- Code-split by route
- Optimize bundle size (tree shaking, minification)
- Use React.memo for expensive components
- Debounce search inputs

### Mobile
- Image caching with Expo Image
- Reduce network requests (batch operations if possible)
- Prefetch next page data
- Optimize re-renders with useMemo/useCallback

## Testing Strategy

### Backend Testing
- **Unit tests**: Service logic, utility functions (80%+ coverage goal)
- **Integration tests**: Database operations, module interactions
- **Contract tests**: API endpoint responses match OpenAPI spec (critical)
- Use `@nestjs/testing` for dependency injection in tests
- Mock external services (Cloudinary, Expo notifications)

### Frontend Testing
- **Component tests**: Render, user interactions, edge cases
- **Hook tests**: Custom hooks logic
- **Integration tests**: Screen flows (login → view plants → add plant)
- Mock API calls with MSW (Mock Service Worker)
- Test accessibility (screen readers, keyboard navigation)

### E2E Testing (Post-MVP)
- Critical user journeys
- Cross-browser testing for web
- Device testing for mobile (iOS/Android)

## Development Workflow

### Local Development Setup
1. PostgreSQL via Docker Compose
2. Backend: `npm run start:dev` (hot reload)
3. Mobile: `expo start` (Expo Go for testing)
4. Web: `npm run dev` (Vite dev server)

### Environment Management
- `.env` files for local development
- Separate configs for dev/staging/production
- Never commit secrets to git
- Use environment-specific API URLs

### Git Workflow
- Feature branches from main
- Pull requests with spec links
- Code review required before merge
- Conventional commits (feat:, fix:, docs:)

## Deployment Strategy (Post-Planning)

### Backend
- Docker container deployed to cloud (Heroku/Railway/Render for MVP)
- Environment variables via platform config
- Database migrations run automatically on deploy
- Health check endpoint for monitoring

### Mobile
- Expo Application Services (EAS) for builds
- TestFlight (iOS) and Google Play internal testing
- OTA updates for JS changes (no app store review)

### Web
- Static hosting on Vercel or Netlify
- Automatic deployments from main branch
- Environment variables in platform settings
- CDN distribution for global performance

## Monitoring & Logging

### Application Monitoring
- Structured logging with Winston or Pino
- Log levels: error, warn, info, debug
- Centralized logs (consider LogDNA, Papertrail for MVP)

### Error Tracking
- Sentry for backend and frontend error tracking
- Track API errors, unhandled exceptions
- User context in error reports

### Performance Monitoring
- API response time tracking
- Database query performance
- Frontend Core Web Vitals

## Next Steps

With research complete, proceed to Phase 1 design artifacts:
1. [data-model.md](./data-model.md) - Define entity schemas
2. [contracts/](./contracts/) - Generate OpenAPI specifications
3. [quickstart.md](./quickstart.md) - Developer onboarding guide
