# Implementation Plan: Plant Management MVP

**Branch**: `001-plant-management-mvp` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-plant-management-mvp/spec.md`

## Summary

The Plant Management MVP enables users to register and track their houseplants, access expert-curated plant care information with FAQs, and manage watering schedules with notifications. The system supports three user roles (end users, experts, administrators) with role-based access control enforced at the API level. This is a full-stack application with React Native mobile app, React web app, and Node.js backend API following API-first architecture principles.

## Technical Context

**Language/Version**:
- Backend: Node.js 18+ with TypeScript 5.x
- Mobile: React Native 0.72+ with TypeScript
- Web: React 18+ with TypeScript 5.x

**Primary Dependencies**:
- Backend: NestJS (preferred for structure and DI), TypeORM, PostgreSQL client, bcrypt, jsonwebtoken, class-validator
- Mobile: Expo SDK 49+, React Navigation, React Native Paper (UI), Axios, AsyncStorage
- Web: Vite 4+, React Router, Material-UI or Tailwind CSS, Axios
- Shared: date-fns (timezone handling), zod (validation)

**Storage**:
- Database: PostgreSQL 14+ (relational data for users, plants, schedules, species)
- File Storage: Cloudinary or AWS S3 (plant photos)
- Mobile Cache: AsyncStorage (offline plant data)
- Web Cache: LocalStorage (session persistence)

**Testing**:
- Backend: Jest + Supertest (API contract tests), ts-jest
- Mobile: Jest + React Native Testing Library
- Web: Vitest + React Testing Library
- E2E: Deferred post-MVP

**Target Platform**:
- Backend: Node.js runtime (Docker container, Cloud hosting)
- Mobile: iOS 13+ and Android 8.0+ (via Expo)
- Web: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

**Project Type**: Mobile + Web + API (3 separate projects)

**Performance Goals**:
- API response time: <2s for 95th percentile
- Mobile app: <3s initial load, smooth 60fps scrolling
- Web app: <3s initial load on 3G connection
- Notification delivery: Within 1 hour of scheduled time
- Image upload: Support up to 10MB, complete within 30s
- Concurrent users: Handle 100 concurrent users initially

**Constraints**:
- Offline-first for mobile: Plant collection and species data must be cached and viewable offline
- Mobile-first design: Touch-optimized UI, consider network performance
- GDPR compliance: User data export, deletion, consent management
- Role-based access: API-level enforcement, no client-side-only checks
- Cross-platform consistency: Same business logic and API contracts for mobile and web

**Scale/Scope**:
- Expected users: 1,000-10,000 end users in first 6 months
- Plant species database: 100-500 species at launch
- User plant collections: 5-50 plants per user average
- Photos: 5 photos per plant, ~1-5MB each
- Notifications: Daily batch processing, ~1,000-5,000 per day
- API endpoints: ~30-40 endpoints for MVP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Cross-Platform Consistency
✅ **PASS**: Architecture includes React Native (mobile) and React (web) with shared REST API. Business logic resides in backend API. UI components will be platform-specific but follow same design patterns.

### Principle II: API-First Architecture
✅ **PASS**: Backend REST API will be implemented before frontend UIs. OpenAPI documentation will be generated. All data access goes through versioned API endpoints (/api/v1/).

### Principle III: User Role Separation (NON-NEGOTIABLE)
✅ **PASS**: Functional requirements FR-003 and FR-004 explicitly define three roles (end user, expert, administrator) with API-level authorization checks. NestJS guards will enforce role-based access control.

### Principle IV: Mobile-First Design
✅ **PASS**: Technical context prioritizes mobile platform. React Native app will be primary development focus. Offline capabilities and mobile performance are explicit constraints. Web app is secondary adaptation.

### Principle V: Data Privacy & Ownership
✅ **PASS**: FR-039 requires data export functionality. User data isolation enforced (FR-015). GDPR compliance listed as constraint. Photo storage will use secure cloud service with access control.

### Principle VI: Incremental Delivery
✅ **PASS**: Spec defines 4 independently testable user stories with clear priorities (P1, P2, P3). Each story delivers standalone value. Implementation will follow story priority order.

**Constitution Gate Status**: ✅ ALL CHECKS PASS - Proceed to Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/001-plant-management-mvp/
├── spec.md              # Feature specification (already created)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (technology research and decisions)
├── data-model.md        # Phase 1 output (entity schemas and relationships)
├── quickstart.md        # Phase 1 output (developer onboarding guide)
├── contracts/           # Phase 1 output (OpenAPI specs)
│   ├── auth.yaml
│   ├── plants.yaml
│   ├── species.yaml
│   ├── schedules.yaml
│   └── admin.yaml
└── checklists/          # Validation checklists
    └── requirements.md  # Already created
```

### Source Code (repository root)

This is a multi-platform project requiring three separate applications:

```text
DrPlantes/
├── backend/                 # Node.js + NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module (JWT, guards, strategies)
│   │   ├── users/          # User management module
│   │   ├── plants/         # Plant registry module
│   │   ├── species/        # Plant species information module
│   │   ├── schedules/      # Watering schedules module
│   │   ├── notifications/  # Notification service module
│   │   ├── admin/          # Admin functions module
│   │   ├── common/         # Shared utilities, decorators, filters
│   │   │   ├── guards/     # Role guards, auth guards
│   │   │   ├── decorators/ # Custom decorators
│   │   │   └── filters/    # Exception filters
│   │   ├── database/       # Database config, migrations
│   │   │   ├── entities/   # TypeORM entities
│   │   │   └── migrations/ # Database migrations
│   │   └── main.ts         # Application entry point
│   ├── test/
│   │   ├── contract/       # API contract tests (Supertest)
│   │   ├── integration/    # Integration tests
│   │   └── unit/           # Unit tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── mobile/                  # React Native + Expo app
│   ├── src/
│   │   ├── navigation/     # React Navigation setup
│   │   ├── screens/        # Screen components
│   │   │   ├── Auth/       # Login, Register screens
│   │   │   ├── Plants/     # Plant list, detail, add/edit screens
│   │   │   ├── Species/    # Species search, detail screens
│   │   │   ├── Schedule/   # Watering calendar, history screens
│   │   │   └── Profile/    # User profile, settings screens
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client, storage utilities
│   │   │   ├── api/        # Axios client, API endpoints
│   │   │   ├── storage/    # AsyncStorage wrapper
│   │   │   └── notifications/ # Push notification setup
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context (auth, theme)
│   │   ├── types/          # TypeScript types/interfaces
│   │   └── utils/          # Helpers, formatters
│   ├── assets/             # Images, fonts
│   ├── App.tsx             # Root component
│   ├── app.json            # Expo config
│   ├── package.json
│   └── tsconfig.json
│
├── web/                     # React + Vite web app
│   ├── src/
│   │   ├── pages/          # Page components (React Router)
│   │   │   ├── Auth/       # Login, Register pages
│   │   │   ├── Plants/     # Plant list, detail, add/edit pages
│   │   │   ├── Species/    # Species search, detail pages
│   │   │   ├── Schedule/   # Watering calendar, history pages
│   │   │   ├── Admin/      # Admin dashboard pages
│   │   │   └── Profile/    # User profile, settings pages
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client
│   │   │   └── api/        # Axios client, API endpoints
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context (auth, theme)
│   │   ├── types/          # TypeScript types/interfaces
│   │   ├── utils/          # Helpers, formatters
│   │   ├── App.tsx         # Root component with Router
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── shared/                  # Shared TypeScript types (optional)
│   └── types/              # API contracts as TypeScript interfaces
│
├── .gitignore
├── README.md
└── docker-compose.yml      # Local development environment (PostgreSQL, etc.)
```

**Structure Decision**: Selected "Mobile + Web + API" architecture (Option 3) due to requirements for both React Native mobile app and React web app, plus backend API. This structure:
- Separates concerns clearly (backend, mobile, web)
- Enables independent deployment and scaling
- Supports different teams working in parallel
- Follows constitution's API-first and cross-platform principles
- Mobile and web can share API client code and type definitions via `shared/` directory

## Complexity Tracking

No constitution violations. All principles satisfied by the chosen architecture.

## Phase 0: Research & Technology Decisions

See [research.md](./research.md) for detailed technology research, best practices, and architectural decisions.

## Phase 1: Design Artifacts

The following artifacts will be generated in Phase 1:
- [data-model.md](./data-model.md) - Entity schemas, relationships, validation rules
- [contracts/](./contracts/) - OpenAPI specifications for all API endpoints
- [quickstart.md](./quickstart.md) - Developer setup and onboarding guide
