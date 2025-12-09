# Developer Quickstart Guide: DrPlantes MVP

**Last Updated**: 2025-12-07
**Target Audience**: Developers setting up local development environment

## Overview

This guide walks you through setting up the DrPlantes Plant Management MVP development environment. You'll have the backend API, mobile app, and web app running locally within 30 minutes.

## Prerequisites

### Required Software

- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**: Comes with Node.js
- **PostgreSQL**: v14+ ([Download](https://www.postgresql.org/download/))
- **Git**: For version control
- **Docker** (optional): For running PostgreSQL in a container

### Mobile Development (Optional)

- **Expo Go App**: Install on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **iOS Development**: Xcode (Mac only)
- **Android Development**: Android Studio

### Recommended Tools

- **VS Code**: With extensions (ESLint, Prettier, TypeScript)
- **Postman** or **Insomnia**: For API testing
- **PostgreSQL GUI**: pgAdmin, Postico, or DBeaver

---

## Project Structure Overview

```
DrPlantes/
├── backend/      # NestJS API
├── mobile/       # React Native + Expo
├── web/          # React + Vite
└── shared/       # Shared TypeScript types
```

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd DrPlantes
```

---

## Step 2: Database Setup

### Option A: Docker (Recommended)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: drplantes-db
    environment:
      POSTGRES_USER: drplantes
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: drplantes_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start PostgreSQL:

```bash
docker-compose up -d
```

### Option B: Local PostgreSQL Installation

1. Install PostgreSQL 14+
2. Create database and user:

```sql
CREATE DATABASE drplantes_dev;
CREATE USER drplantes WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE drplantes_dev TO drplantes;
```

### Verify Database Connection

```bash
psql -h localhost -U drplantes -d drplantes_dev
# Password: dev_password
```

---

## Step 3: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

Create `.env` file in `backend/` directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=drplantes
DATABASE_PASSWORD=dev_password
DATABASE_NAME=drplantes_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for password reset)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@drplantes.com
```

> **Note**: For local development, you can use placeholder values for Cloudinary and Email. These are only needed for image uploads and password reset features.

### Run Database Migrations

```bash
npm run migration:run
```

### Seed Database (Optional)

```bash
npm run seed
```

This creates:
- 1 admin user (admin@drplantes.com / admin123)
- 1 expert user (expert@drplantes.com / expert123)
- 1 end user (user@drplantes.com / user123)
- 20 common plant species with FAQs
- Sample plants for the end user

### Start Backend Server

```bash
npm run start:dev
```

Backend should be running at `http://localhost:3000`

### Verify Backend

Open browser and navigate to:
- API Health: http://localhost:3000/health
- Swagger Docs: http://localhost:3000/api/docs

---

## Step 4: Mobile App Setup

### Install Dependencies

```bash
cd ../mobile
npm install
```

### Environment Configuration

Create `.env` file in `mobile/` directory:

```env
API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api/v1
```

> **Important**: Replace `192.168.1.XXX` with your computer's local IP address. Find it with:
> - Mac: `ifconfig | grep "inet "`
> - Windows: `ipconfig`
> - Linux: `ip addr show`

### Start Expo Development Server

```bash
npx expo start
```

### Run on Device/Emulator

**Option 1: Physical Device (Easiest)**
1. Install Expo Go app on your phone
2. Scan QR code from terminal with camera (iOS) or Expo Go app (Android)

**Option 2: iOS Simulator (Mac only)**
1. Press `i` in terminal
2. Simulator will launch automatically

**Option 3: Android Emulator**
1. Start Android emulator from Android Studio
2. Press `a` in terminal

---

## Step 5: Web App Setup

### Install Dependencies

```bash
cd ../web
npm install
```

### Environment Configuration

Create `.env` file in `web/` directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Start Development Server

```bash
npm run dev
```

Web app should be running at `http://localhost:5173`

---

## Step 6: Verify Everything Works

### Test Backend API

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@drplantes.com","password":"user123"}'
```

You should receive a JWT token.

### Test Mobile App

1. Open app on device/simulator
2. Login with: user@drplantes.com / user123
3. You should see the plant list screen

### Test Web App

1. Open http://localhost:5173 in browser
2. Login with: user@drplantes.com / user123
3. You should see the dashboard

---

## Common Commands

### Backend

```bash
# Development mode (hot reload)
npm run start:dev

# Run tests
npm run test

# Run contract tests
npm run test:contract

# Create new migration
npm run migration:create --name=AddPlantField

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Format code
npm run format

# Lint code
npm run lint
```

### Mobile

```bash
# Start Expo dev server
npx expo start

# Clear cache and restart
npx expo start -c

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Run tests
npm run test

# Build for production
eas build --platform ios
```

### Web

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type check
npm run type-check
```

---

## Troubleshooting

### Backend won't start

**Problem**: `ECONNREFUSED` or database connection error

**Solution**:
1. Verify PostgreSQL is running: `docker-compose ps` or `pg_isready`
2. Check `.env` file has correct database credentials
3. Ensure database exists: `psql -l`

**Problem**: Port 3000 already in use

**Solution**:
1. Find process using port: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)
2. Kill process or change `PORT` in `.env`

### Mobile app can't connect to API

**Problem**: Network request failed or timeout

**Solution**:
1. Ensure backend is running: `curl http://localhost:3000/health`
2. Use correct IP address in `EXPO_PUBLIC_API_URL` (not localhost!)
3. Check firewall isn't blocking port 3000
4. On Android emulator, use `10.0.2.2` instead of localhost

### Database migrations fail

**Problem**: Migration already exists or syntax error

**Solution**:
1. Check migration files in `backend/src/database/migrations/`
2. Manually fix SQL if needed
3. Drop database and recreate if in development:
   ```bash
   npm run db:drop
   npm run migration:run
   npm run seed
   ```

### Expo app shows "Unable to resolve module"

**Problem**: Module not found or cache issue

**Solution**:
```bash
# Clear Metro bundler cache
npx expo start -c

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## Development Workflow

### Creating a New Feature

1. **Create feature branch**:
   ```bash
   git checkout -b feature/add-plant-sharing
   ```

2. **Write specification** using `/speckit.specify`

3. **Create plan** using `/speckit.plan`

4. **Generate tasks** using `/speckit.tasks`

5. **Implement**:
   - Start with backend API (API-first principle)
   - Write contract tests
   - Implement mobile UI
   - Implement web UI
   - Test cross-platform consistency

6. **Test**:
   ```bash
   # Backend
   cd backend && npm run test

   # Mobile
   cd mobile && npm run test

   # Web
   cd web && npm run test
   ```

7. **Create pull request** linking to specification

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write JSDoc comments for public APIs
- Use conventional commits (feat:, fix:, docs:, etc.)

### Testing

- Unit tests: Test individual functions/components
- Integration tests: Test module interactions
- Contract tests: Test API matches OpenAPI spec
- E2E tests: Test critical user journeys (post-MVP)

---

## Useful Resources

### Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Docs](https://react.dev/)
- [TypeORM Docs](https://typeorm.io/)

### Project Docs
- [Constitution](./.specify/memory/constitution.md) - Project principles
- [Specification](./specs/001-plant-management-mvp/spec.md) - Feature requirements
- [Data Model](./specs/001-plant-management-mvp/data-model.md) - Database schema
- [API Contracts](./specs/001-plant-management-mvp/contracts/) - OpenAPI specs

### Tools
- [OpenAPI Generator](https://openapi-generator.tech/) - Generate types from contracts
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug React
- [Flipper](https://fbflipper.com/) - Debug React Native

---

## Getting Help

- **Bugs**: Create issue in GitHub repository
- **Questions**: Check project documentation or ask in team chat
- **Code Review**: Tag relevant team members in pull requests

---

## Next Steps

Now that your environment is set up:

1. **Explore the codebase**: Read through `backend/src/`, `mobile/src/`, `web/src/`
2. **Run tests**: Verify all tests pass
3. **Review specifications**: Read [spec.md](./specs/001-plant-management-mvp/spec.md)
4. **Start with a task**: Pick a task from `/speckit.tasks` output
5. **Make your first contribution**: Fix a bug or add a small feature

Happy coding! 🌱
