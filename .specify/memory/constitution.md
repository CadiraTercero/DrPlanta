<!--
Sync Impact Report:
- Version change: [CONSTITUTION_VERSION] → 1.0.0
- Initial constitution creation for DrPlantes project
- Core principles established: 6 principles defined
- Architecture sections added: Technology Stack, Platform Requirements, Development Workflow
- Templates alignment: ✅ All templates verified for compatibility
- Follow-up TODOs: None - all placeholders resolved
-->

# DrPlantes Constitution

## Core Principles

### I. Cross-Platform Consistency
All features MUST provide consistent user experience across mobile (React Native) and web (React) platforms. UI components should be designed platform-first but share business logic wherever possible. Platform-specific adaptations are allowed only when justified by native capabilities or UX conventions (e.g., mobile gestures, web keyboard shortcuts).

**Rationale**: Users expect the same functionality whether accessing via phone or web browser. Shared logic reduces maintenance burden and ensures feature parity.

### II. API-First Architecture
Every feature MUST be exposed through the backend REST API before implementing frontend UI. APIs must be versioned, documented, and contract-tested. No direct database access from frontend applications.

**Rationale**: Decoupling frontend from backend enables independent development, testing, and scaling. Multiple clients (mobile, web, future integrations) can consume the same API.

### III. User Role Separation (NON-NEGOTIABLE)
The system MUST support three distinct user roles with separate capabilities:
- **End Users**: Manage personal plant collections, access care information, set watering schedules
- **Administrators**: User management, content moderation, system configuration
- **Experts**: Create and maintain plant information database, FAQs, care guidelines

Authorization checks MUST be enforced at API level. Role-based access control cannot be bypassed.

**Rationale**: Different user types have different needs and permissions. Security and data integrity require strict role enforcement.

### IV. Mobile-First Design
Features MUST be designed for mobile users first, then adapted for web. Consider touch interactions, screen sizes, offline capabilities, and performance on mobile networks. Web enhancements (larger screens, keyboard navigation) are secondary.

**Rationale**: Primary use case is phone users checking plant care while physically near their plants. Mobile context drives design decisions.

### V. Data Privacy & Ownership
Users MUST own their plant data. Export functionality is mandatory. Personal information (location, photos, schedules) MUST be protected. Compliance with GDPR/privacy regulations is required before launch.

**Rationale**: Plant collections are personal. Users must trust the system with their data and have control over it.

### VI. Incremental Delivery
Features MUST be delivered as independently testable user stories. Each story should provide standalone value. MVP (user plant registry, information/FAQ, watering calendar) takes precedence over enhancements.

**Rationale**: Validate core value proposition before building advanced features. Independent stories enable faster feedback and iteration.

## Technology Stack

**Backend**:
- Language: Node.js with TypeScript
- Framework: Express.js or NestJS
- Database: PostgreSQL (relational data for plants, users, schedules)
- Authentication: JWT-based authentication
- API Documentation: OpenAPI/Swagger

**Mobile Application**:
- Framework: React Native
- Development tool: Expo (rapid iteration, easier initial setup)
- Platform targets: iOS and Android
- State management: React Context API or Redux Toolkit
- UI components: React Native Paper or native components

**Web Application**:
- Framework: React with TypeScript
- Build tool: Vite
- State management: Shared approach with mobile (Context API or Redux Toolkit)
- UI framework: Material-UI or Tailwind CSS
- Deployment: Static hosting (Vercel, Netlify)

**Testing**:
- Backend: Jest + Supertest (API contract tests)
- Frontend: Jest + React Testing Library
- E2E (optional for MVP): Cypress or Playwright

**Infrastructure**:
- Version control: Git
- CI/CD: GitHub Actions or similar
- Hosting: Cloud provider (AWS, Google Cloud, or Heroku for MVP)
- Environment management: Docker for consistent development

## Platform Requirements

### Backend API Requirements
- RESTful design principles
- JSON request/response format
- HTTP status codes correctly implemented
- Error responses in consistent format
- API versioning (e.g., /api/v1/)
- Request validation and sanitization
- Rate limiting for public endpoints
- Comprehensive logging (requests, errors, security events)

### Mobile Application Requirements
- Minimum iOS 13+ and Android 8.0+ support
- Offline-first approach where feasible (cached plant information, scheduled notifications)
- Push notifications for watering reminders
- Camera integration for plant photos
- Local storage for user preferences
- Responsive to device orientation changes
- Accessibility compliance (VoiceOver, TalkBack support)

### Web Application Requirements
- Browser support: Latest 2 versions of Chrome, Firefox, Safari, Edge
- Progressive Web App (PWA) capabilities considered for future
- Responsive design (mobile, tablet, desktop viewports)
- Keyboard navigation support
- WCAG 2.1 Level AA accessibility compliance
- Performance budget: <3s initial load on 3G

## Development Workflow

### Spec-Driven Development Process
1. Constitution defines non-negotiable principles (this document)
2. Specifications created for each feature (/speckit.specify)
3. Implementation plans derived from specs (/speckit.plan)
4. Tasks broken down from plans (/speckit.tasks)
5. Implementation follows tasks (/speckit.implement)

### Code Quality Gates
- Linting: ESLint with TypeScript rules (backend and frontend)
- Formatting: Prettier with consistent configuration
- Type checking: TypeScript strict mode enabled
- Tests: API contract tests required for new endpoints
- Code review: Required before merging to main branch
- Security scanning: Dependencies checked for vulnerabilities

### Version Control Standards
- Branching strategy: Feature branches from main
- Branch naming: `feature/###-feature-name` or `fix/###-bug-description`
- Commit messages: Conventional commits format (feat:, fix:, docs:, etc.)
- Pull requests: Must link to specification document
- Main branch: Always deployable state

## Governance

This constitution supersedes all other development practices and guidelines. All architecture decisions, feature implementations, and code reviews MUST comply with these principles.

**Amendment Process**:
- Proposed changes must include rationale and impact analysis
- Constitution amendments require documentation of breaking changes
- Version number must be updated using semantic versioning
- Templates and dependent documents must be updated to reflect amendments

**Compliance Review**:
- All pull requests must verify alignment with constitution principles
- Violations of NON-NEGOTIABLE principles are blocking
- Other principle violations require explicit justification and approval
- Complexity additions must document simpler alternatives considered

**Runtime Guidance**:
- Developers should reference this constitution before designing new features
- When in doubt, consult principle rationales for decision guidance
- Templates in `.specify/templates/` provide concrete implementation patterns

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07
