# Tasks: Plant Management MVP

**Input**: Design documents from `/specs/001-plant-management-mvp/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this MVP. Focus on implementation first. Contract tests can be added post-MVP if desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a multi-platform project with three separate applications:
- **Backend**: `backend/src/`
- **Mobile**: `mobile/src/`
- **Web**: `web/src/`
- **Shared**: `shared/types/` (optional shared TypeScript types)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for all three applications

- [X] T001 Create root project structure with backend/, mobile/, web/, and shared/ directories
- [X] T002 Create docker-compose.yml for PostgreSQL development environment
- [X] T003 Create root README.md with project overview and quickstart instructions
- [X] T004 Create root .gitignore with Node.js, TypeScript, Expo, and IDE patterns
- [X] T005 [P] Initialize backend NestJS project in backend/ with TypeScript configuration
- [X] T006 [P] Initialize mobile Expo project in mobile/ with TypeScript template
- [X] T007 [P] Initialize web Vite+React project in web/ with TypeScript template
- [X] T008 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js and backend/.prettierrc
- [X] T009 [P] Configure ESLint and Prettier for mobile in mobile/.eslintrc.js and mobile/.prettierrc
- [X] T010 [P] Configure ESLint and Prettier for web in web/.eslintrc.js and web/.prettierrc

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T011 Install backend dependencies (NestJS, TypeORM, PostgreSQL, bcrypt, jsonwebtoken, class-validator, passport)
- [ ] T012 Configure TypeORM database connection in backend/src/database/database.module.ts
- [ ] T013 Create backend environment configuration module in backend/src/config/config.module.ts
- [ ] T014 Create .env.example file in backend/ with all required environment variables
- [ ] T015 Create global exception filter in backend/src/common/filters/http-exception.filter.ts
- [ ] T016 Create global validation pipe configuration in backend/src/main.ts
- [ ] T017 Set up Swagger/OpenAPI documentation in backend/src/main.ts
- [ ] T018 Create base entity class with id, createdAt, updatedAt in backend/src/database/entities/base.entity.ts

### Mobile Foundation

- [ ] T019 Install mobile dependencies (React Navigation, React Native Paper, Axios, AsyncStorage, date-fns)
- [ ] T020 Configure Expo app.json with app name, bundle identifier, and permissions
- [ ] T021 Create mobile environment configuration in mobile/src/config/config.ts
- [ ] T022 Create Axios API client instance in mobile/src/services/api/client.ts
- [ ] T023 Create AsyncStorage wrapper utilities in mobile/src/services/storage/storage.ts
- [ ] T024 Set up React Navigation container in mobile/App.tsx
- [ ] T025 Create theme configuration with React Native Paper in mobile/src/config/theme.ts

### Web Foundation

- [ ] T026 Install web dependencies (React Router, Material-UI or Tailwind CSS, Axios, date-fns)
- [ ] T027 Configure Vite with environment variables in web/vite.config.ts
- [ ] T028 Create web environment configuration in web/src/config/config.ts
- [ ] T029 Create Axios API client instance in web/src/services/api/client.ts
- [ ] T030 Set up React Router in web/src/App.tsx
- [ ] T031 Create theme configuration in web/src/config/theme.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 4 - User Authentication and Account Management (Priority: P1) 🎯 MVP

**Goal**: Implement secure authentication system with registration, login, password reset, and profile management. Support three user roles (end user, expert, admin) with role-based access control.

**Independent Test**: A new user can register with email and password, log in, access their profile, update their information, and log out. Admins can assign roles.

### Backend - Authentication Module

- [ ] T032 [P] [US4] Create User entity in backend/src/database/entities/user.entity.ts with id, email, passwordHash, displayName, role, expoPushToken, isActive, timestamps
- [ ] T033 [P] [US4] Create initial database migration for users table in backend/src/database/migrations/
- [ ] T034 [US4] Run database migration to create users table
- [ ] T035 [P] [US4] Create RegisterDto in backend/src/auth/dto/register.dto.ts with validation decorators
- [ ] T036 [P] [US4] Create LoginDto in backend/src/auth/dto/login.dto.ts with validation decorators
- [ ] T037 [P] [US4] Create UpdateUserDto in backend/src/auth/dto/update-user.dto.ts
- [ ] T038 [P] [US4] Create AuthResponse interface in backend/src/auth/interfaces/auth-response.interface.ts
- [ ] T039 [US4] Create UsersService in backend/src/users/users.service.ts with CRUD operations and password hashing (bcrypt)
- [ ] T040 [US4] Create AuthService in backend/src/auth/auth.service.ts with register, login, validateUser, and generateJWT methods
- [ ] T041 [US4] Configure JWT strategy in backend/src/auth/strategies/jwt.strategy.ts
- [ ] T042 [US4] Configure local strategy (email/password) in backend/src/auth/strategies/local.strategy.ts
- [ ] T043 [US4] Create JwtAuthGuard in backend/src/common/guards/jwt-auth.guard.ts
- [ ] T044 [US4] Create RolesGuard in backend/src/common/guards/roles.guard.ts with role checking logic
- [ ] T045 [US4] Create Roles decorator in backend/src/common/decorators/roles.decorator.ts
- [ ] T046 [US4] Create GetUser decorator in backend/src/common/decorators/get-user.decorator.ts
- [ ] T047 [US4] Create AuthController in backend/src/auth/auth.controller.ts with POST /auth/register and POST /auth/login endpoints
- [ ] T048 [US4] Add POST /auth/reset-password endpoint to AuthController
- [ ] T049 [US4] Add POST /auth/reset-password/confirm endpoint to AuthController
- [ ] T050 [US4] Create UsersController in backend/src/users/users.controller.ts with GET, PUT, DELETE /users/me endpoints
- [ ] T051 [US4] Add GET /users/me/export endpoint for GDPR data export to UsersController
- [ ] T052 [US4] Register AuthModule and UsersModule in backend/src/app.module.ts

### Mobile - Authentication Screens

- [ ] T053 [P] [US4] Create AuthContext in mobile/src/context/AuthContext.tsx with login, logout, register state management
- [ ] T054 [P] [US4] Create auth API service in mobile/src/services/api/auth.ts with register, login, logout functions
- [ ] T055 [P] [US4] Create user API service in mobile/src/services/api/users.ts with getProfile, updateProfile, deleteAccount
- [ ] T056 [P] [US4] Create RegisterScreen in mobile/src/screens/Auth/RegisterScreen.tsx with form inputs and validation
- [ ] T057 [P] [US4] Create LoginScreen in mobile/src/screens/Auth/LoginScreen.tsx with email/password form
- [ ] T058 [P] [US4] Create ForgotPasswordScreen in mobile/src/screens/Auth/ForgotPasswordScreen.tsx
- [ ] T059 [P] [US4] Create ProfileScreen in mobile/src/screens/Profile/ProfileScreen.tsx with user info display and edit button
- [ ] T060 [P] [US4] Create EditProfileScreen in mobile/src/screens/Profile/EditProfileScreen.tsx
- [ ] T061 [US4] Create authentication stack navigator in mobile/src/navigation/AuthNavigator.tsx
- [ ] T062 [US4] Create main app stack navigator in mobile/src/navigation/AppNavigator.tsx
- [ ] T063 [US4] Implement navigation switching based on auth state in mobile/App.tsx
- [ ] T064 [US4] Add token storage and retrieval with SecureStore in mobile/src/services/storage/tokenStorage.ts
- [ ] T065 [US4] Add token interceptor to Axios client in mobile/src/services/api/client.ts

### Web - Authentication Pages

- [ ] T066 [P] [US4] Create AuthContext in web/src/context/AuthContext.tsx with login, logout, register state management
- [ ] T067 [P] [US4] Create auth API service in web/src/services/api/auth.ts with register, login, logout functions
- [ ] T068 [P] [US4] Create user API service in web/src/services/api/users.ts with getProfile, updateProfile, deleteAccount
- [ ] T069 [P] [US4] Create RegisterPage in web/src/pages/Auth/RegisterPage.tsx with form
- [ ] T070 [P] [US4] Create LoginPage in web/src/pages/Auth/LoginPage.tsx
- [ ] T071 [P] [US4] Create ForgotPasswordPage in web/src/pages/Auth/ForgotPasswordPage.tsx
- [ ] T072 [P] [US4] Create ProfilePage in web/src/pages/Profile/ProfilePage.tsx
- [ ] T073 [P] [US4] Create EditProfilePage in web/src/pages/Profile/EditProfilePage.tsx
- [ ] T074 [US4] Configure protected and public routes in web/src/App.tsx with authentication checks
- [ ] T075 [US4] Add token storage and retrieval with localStorage in web/src/services/storage/tokenStorage.ts
- [ ] T076 [US4] Add token interceptor to Axios client in web/src/services/api/client.ts

**Checkpoint**: At this point, User Story 4 (Authentication) should be fully functional and testable independently. Users can register, login, manage their profile, and the system enforces authentication.

---

## Phase 4: User Story 1 - Register and Track Personal Plants (Priority: P1) 🎯 MVP

**Goal**: Enable users to register their houseplants with name, location, photos, and notes. Users can view, edit, and delete their plant collection.

**Independent Test**: A logged-in user can add a new plant with name and location, view it in their collection list, view detailed information, edit plant details, upload photos, and delete the plant.

### Backend - Plants Module

- [ ] T077 [P] [US1] Create Plant entity in backend/src/database/entities/plant.entity.ts with id, userId, speciesId, name, location, acquisitionDate, notes, photos (JSONB), timestamps
- [ ] T078 [US1] Create database migration for plants table in backend/src/database/migrations/
- [ ] T079 [US1] Run database migration to create plants table
- [ ] T080 [P] [US1] Create CreatePlantDto in backend/src/plants/dto/create-plant.dto.ts
- [ ] T081 [P] [US1] Create UpdatePlantDto in backend/src/plants/dto/update-plant.dto.ts
- [ ] T082 [P] [US1] Create PlantResponse interface in backend/src/plants/interfaces/plant-response.interface.ts
- [ ] T083 [US1] Create PlantsService in backend/src/plants/plants.service.ts with create, findAll, findOne, update, delete methods
- [ ] T084 [US1] Add photo upload method to PlantsService with Cloudinary integration
- [ ] T085 [US1] Add photo delete method to PlantsService
- [ ] T086 [US1] Create PlantsController in backend/src/plants/plants.controller.ts with GET, POST, PUT, DELETE /plants endpoints
- [ ] T087 [US1] Add POST /plants/:id/photos endpoint to PlantsController with file upload handling
- [ ] T088 [US1] Add DELETE /plants/:id/photos/:photoId endpoint to PlantsController
- [ ] T089 [US1] Add JwtAuthGuard and user ownership checks to all plant endpoints
- [ ] T090 [US1] Register PlantsModule in backend/src/app.module.ts

### Mobile - Plants Screens

- [ ] T091 [P] [US1] Create plants API service in mobile/src/services/api/plants.ts with CRUD and photo upload functions
- [ ] T092 [P] [US1] Create PlantListScreen in mobile/src/screens/Plants/PlantListScreen.tsx with FlatList of plants
- [ ] T093 [P] [US1] Create PlantDetailScreen in mobile/src/screens/Plants/PlantDetailScreen.tsx showing all plant info
- [ ] T094 [P] [US1] Create AddPlantScreen in mobile/src/screens/Plants/AddPlantScreen.tsx with form inputs
- [ ] T095 [P] [US1] Create EditPlantScreen in mobile/src/screens/Plants/EditPlantScreen.tsx with pre-filled form
- [ ] T096 [P] [US1] Create PlantCard component in mobile/src/components/PlantCard.tsx for list items
- [ ] T097 [P] [US1] Create PlantPhotosGallery component in mobile/src/components/PlantPhotosGallery.tsx with image carousel
- [ ] T098 [US1] Implement image picker for photo uploads using expo-image-picker in mobile/src/utils/imagePicker.ts
- [ ] T099 [US1] Add offline caching for plant list using AsyncStorage in mobile/src/services/storage/plantsCache.ts
- [ ] T100 [US1] Configure plants stack navigator in mobile/src/navigation/AppNavigator.tsx
- [ ] T101 [US1] Add plants navigation tab/drawer item in mobile/src/navigation/AppNavigator.tsx

### Web - Plants Pages

- [ ] T102 [P] [US1] Create plants API service in web/src/services/api/plants.ts with CRUD and photo upload functions
- [ ] T103 [P] [US1] Create PlantsListPage in web/src/pages/Plants/PlantsListPage.tsx with grid/list view
- [ ] T104 [P] [US1] Create PlantDetailPage in web/src/pages/Plants/PlantDetailPage.tsx
- [ ] T105 [P] [US1] Create AddPlantPage in web/src/pages/Plants/AddPlantPage.tsx with form
- [ ] T106 [P] [US1] Create EditPlantPage in web/src/pages/Plants/EditPlantPage.tsx
- [ ] T107 [P] [US1] Create PlantCard component in web/src/components/PlantCard.tsx
- [ ] T108 [P] [US1] Create PlantPhotosGallery component in web/src/components/PlantPhotosGallery.tsx
- [ ] T109 [US1] Implement file input for photo uploads in web/src/utils/fileUpload.ts
- [ ] T110 [US1] Add plants routes to React Router in web/src/App.tsx

**Checkpoint**: At this point, User Stories 1 and 4 should both work independently. Users can register, login, add/manage their plant collection.

---

## Phase 5: User Story 2 - Access Plant Care Information and FAQs (Priority: P2)

**Goal**: Experts can create and manage plant species information with care instructions and FAQs. End users can search for species, view care guides, and link their plants to species.

**Independent Test**: An expert can create plant species with care instructions and FAQs. An end user can search for "Monstera", view detailed care information, browse FAQs, and optionally link their registered plant to the species entry.

### Backend - Species Module

- [ ] T111 [P] [US2] Create PlantSpecies entity in backend/src/database/entities/plant-species.entity.ts with id, commonName, scientificName, description, care fields, createdBy, timestamps
- [ ] T112 [P] [US2] Create FAQ entity in backend/src/database/entities/faq.entity.ts with id, speciesId, question, answer, displayOrder, timestamps
- [ ] T113 [US2] Create database migration for plant_species and faqs tables in backend/src/database/migrations/
- [ ] T114 [US2] Run database migration to create plant_species and faqs tables
- [ ] T115 [P] [US2] Create CreateSpeciesDto in backend/src/species/dto/create-species.dto.ts
- [ ] T116 [P] [US2] Create UpdateSpeciesDto in backend/src/species/dto/update-species.dto.ts
- [ ] T117 [P] [US2] Create CreateFaqDto in backend/src/species/dto/create-faq.dto.ts
- [ ] T118 [P] [US2] Create SpeciesResponse interface in backend/src/species/interfaces/species-response.interface.ts
- [ ] T119 [US2] Create SpeciesService in backend/src/species/species.service.ts with CRUD, search, and FAQ management methods
- [ ] T120 [US2] Add full-text search functionality to SpeciesService using PostgreSQL tsquery
- [ ] T121 [US2] Create SpeciesController in backend/src/species/species.controller.ts with GET, POST, PUT /species endpoints
- [ ] T122 [US2] Add GET /species/search endpoint to SpeciesController with query parameter
- [ ] T123 [US2] Add POST, PUT, DELETE /species/:id/faqs endpoints to SpeciesController
- [ ] T124 [US2] Add RolesGuard with 'expert' and 'admin' roles to create/update/delete endpoints
- [ ] T125 [US2] Register SpeciesModule in backend/src/app.module.ts
- [ ] T126 [US2] Update PlantsService to support linking plants to species (speciesId field)

### Mobile - Species Screens

- [ ] T127 [P] [US2] Create species API service in mobile/src/services/api/species.ts with search, get, CRUD (expert only)
- [ ] T128 [P] [US2] Create SpeciesSearchScreen in mobile/src/screens/Species/SpeciesSearchScreen.tsx with search input and results list
- [ ] T129 [P] [US2] Create SpeciesDetailScreen in mobile/src/screens/Species/SpeciesDetailScreen.tsx showing care info and FAQs
- [ ] T130 [P] [US2] Create CreateSpeciesScreen in mobile/src/screens/Species/CreateSpeciesScreen.tsx (expert only)
- [ ] T131 [P] [US2] Create EditSpeciesScreen in mobile/src/screens/Species/EditSpeciesScreen.tsx (expert only)
- [ ] T132 [P] [US2] Create SpeciesCard component in mobile/src/components/SpeciesCard.tsx for search results
- [ ] T133 [P] [US2] Create CareInstructions component in mobile/src/components/CareInstructions.tsx for displaying care fields
- [ ] T134 [P] [US2] Create FAQList component in mobile/src/components/FAQList.tsx with expandable items
- [ ] T135 [US2] Add species search/browse to plants navigation in mobile/src/navigation/AppNavigator.tsx
- [ ] T136 [US2] Add "Link to Species" button in PlantDetailScreen with species search modal
- [ ] T137 [US2] Add offline caching for frequently viewed species using AsyncStorage

### Web - Species Pages

- [ ] T138 [P] [US2] Create species API service in web/src/services/api/species.ts with search, get, CRUD (expert only)
- [ ] T139 [P] [US2] Create SpeciesSearchPage in web/src/pages/Species/SpeciesSearchPage.tsx
- [ ] T140 [P] [US2] Create SpeciesDetailPage in web/src/pages/Species/SpeciesDetailPage.tsx
- [ ] T141 [P] [US2] Create CreateSpeciesPage in web/src/pages/Species/CreateSpeciesPage.tsx (expert only)
- [ ] T142 [P] [US2] Create EditSpeciesPage in web/src/pages/Species/EditSpeciesPage.tsx (expert only)
- [ ] T143 [P] [US2] Create SpeciesCard component in web/src/components/SpeciesCard.tsx
- [ ] T144 [P] [US2] Create CareInstructions component in web/src/components/CareInstructions.tsx
- [ ] T145 [P] [US2] Create FAQList component in web/src/components/FAQList.tsx
- [ ] T146 [US2] Add species routes to React Router in web/src/App.tsx
- [ ] T147 [US2] Add "Link to Species" functionality in PlantDetailPage with species search modal

**Checkpoint**: At this point, User Stories 1, 2, and 4 should all work independently. Users can manage plants, search and view plant care information, and experts can manage the species database.

---

## Phase 6: User Story 3 - Create and Manage Watering Schedules (Priority: P3)

**Goal**: Users can create watering schedules for their plants, receive notifications, mark plants as watered, view watering history, and manage schedules.

**Independent Test**: A user with a registered plant can set a watering schedule (e.g., every 7 days), receive a notification when watering is due, mark the plant as watered, view watering history, and edit/snooze the schedule.

### Backend - Schedules Module

- [ ] T148 [P] [US3] Create WateringSchedule entity in backend/src/database/entities/watering-schedule.entity.ts with id, plantId, frequencyDays, lastWateredAt, nextWateringAt, snoozedUntil, isActive, timestamps
- [ ] T149 [P] [US3] Create WateringEvent entity in backend/src/database/entities/watering-event.entity.ts with id, plantId, scheduleId, wateredAt, notes, createdAt
- [ ] T150 [P] [US3] Create Notification entity in backend/src/database/entities/notification.entity.ts with id, userId, plantId, type, title, body, scheduledFor, deliveredAt, isDelivered, isRead, createdAt
- [ ] T151 [US3] Create database migration for watering_schedules, watering_events, notifications tables in backend/src/database/migrations/
- [ ] T152 [US3] Run database migration to create schedules and events tables
- [ ] T153 [P] [US3] Create CreateScheduleDto in backend/src/schedules/dto/create-schedule.dto.ts
- [ ] T154 [P] [US3] Create UpdateScheduleDto in backend/src/schedules/dto/update-schedule.dto.ts
- [ ] T155 [P] [US3] Create WaterPlantDto in backend/src/schedules/dto/water-plant.dto.ts
- [ ] T156 [P] [US3] Create SnoozeScheduleDto in backend/src/schedules/dto/snooze-schedule.dto.ts
- [ ] T157 [US3] Create SchedulesService in backend/src/schedules/schedules.service.ts with CRUD, water, snooze, history methods
- [ ] T158 [US3] Add calculateNextWateringDate method to SchedulesService
- [ ] T159 [US3] Create SchedulesController in backend/src/schedules/schedules.controller.ts with GET, POST, PUT, DELETE /schedules endpoints
- [ ] T160 [US3] Add POST /schedules/:id/water endpoint to SchedulesController
- [ ] T161 [US3] Add POST /schedules/:id/snooze endpoint to SchedulesController
- [ ] T162 [US3] Add GET /schedules/:id/history endpoint to SchedulesController
- [ ] T163 [US3] Add GET /schedules/calendar endpoint to SchedulesController (all upcoming tasks)
- [ ] T164 [US3] Register SchedulesModule in backend/src/app.module.ts

### Backend - Notifications Service

- [ ] T165 [P] [US3] Install Bull (Redis queue) and node-cron dependencies
- [ ] T166 [US3] Create NotificationsService in backend/src/notifications/notifications.service.ts with sendNotification and createNotification methods
- [ ] T167 [US3] Integrate Expo Push Notifications SDK in NotificationsService
- [ ] T168 [US3] Create notification queue using Bull in backend/src/notifications/notifications.queue.ts
- [ ] T169 [US3] Create cron job in backend/src/notifications/notifications.cron.ts to check schedules daily and queue notifications
- [ ] T170 [US3] Create queue processor in backend/src/notifications/notifications.processor.ts to send queued notifications
- [ ] T171 [US3] Add notification retry logic (3 attempts) to processor
- [ ] T172 [US3] Register NotificationsModule in backend/src/app.module.ts

### Mobile - Schedule Screens

- [ ] T173 [P] [US3] Create schedules API service in mobile/src/services/api/schedules.ts with CRUD, water, snooze, history functions
- [ ] T174 [P] [US3] Create WateringCalendarScreen in mobile/src/screens/Schedule/WateringCalendarScreen.tsx showing upcoming tasks
- [ ] T175 [P] [US3] Create WateringHistoryScreen in mobile/src/screens/Schedule/WateringHistoryScreen.tsx for a specific plant
- [ ] T176 [P] [US3] Create CreateScheduleScreen in mobile/src/screens/Schedule/CreateScheduleScreen.tsx with frequency input
- [ ] T177 [P] [US3] Create EditScheduleScreen in mobile/src/screens/Schedule/EditScheduleScreen.tsx
- [ ] T178 [P] [US3] Create ScheduleCard component in mobile/src/components/ScheduleCard.tsx for calendar items
- [ ] T179 [P] [US3] Create WaterButton component in mobile/src/components/WaterButton.tsx with "Mark as Watered" action
- [ ] T180 [US3] Set up Expo Push Notifications in mobile/src/services/notifications/pushNotifications.ts
- [ ] T181 [US3] Request notification permissions and get push token in mobile/App.tsx
- [ ] T182 [US3] Send push token to backend API on login/register
- [ ] T183 [US3] Add notification listener and handler in mobile/App.tsx
- [ ] T184 [US3] Add "Create Schedule" button in PlantDetailScreen
- [ ] T185 [US3] Add schedule display section in PlantDetailScreen (next watering date, frequency)
- [ ] T186 [US3] Add watering calendar to main navigation in mobile/src/navigation/AppNavigator.tsx

### Web - Schedule Pages

- [ ] T187 [P] [US3] Create schedules API service in web/src/services/api/schedules.ts with CRUD, water, snooze, history functions
- [ ] T188 [P] [US3] Create WateringCalendarPage in web/src/pages/Schedule/WateringCalendarPage.tsx
- [ ] T189 [P] [US3] Create WateringHistoryPage in web/src/pages/Schedule/WateringHistoryPage.tsx
- [ ] T190 [P] [US3] Create CreateSchedulePage in web/src/pages/Schedule/CreateSchedulePage.tsx
- [ ] T191 [P] [US3] Create EditSchedulePage in web/src/pages/Schedule/EditSchedulePage.tsx
- [ ] T192 [P] [US3] Create ScheduleCard component in web/src/components/ScheduleCard.tsx
- [ ] T193 [P] [US3] Create WaterButton component in web/src/components/WaterButton.tsx
- [ ] T194 [US3] Add schedule routes to React Router in web/src/App.tsx
- [ ] T195 [US3] Add "Create Schedule" button in PlantDetailPage
- [ ] T196 [US3] Add schedule display section in PlantDetailPage
- [ ] T197 [US3] Add watering calendar to main navigation menu

**Checkpoint**: All user stories should now be independently functional. Users have complete plant management with authentication, plant registry, species information, and watering schedules with notifications.

---

## Phase 7: Admin Functions (Supporting Feature)

**Goal**: Administrators can view all users, change user roles, deactivate accounts, and view platform statistics.

**Independent Test**: An admin user can log in, view user list, change a user's role from end_user to expert, deactivate a user account, and view dashboard statistics.

### Backend - Admin Module

- [ ] T198 [P] Create AdminService in backend/src/admin/admin.service.ts with user management and stats methods
- [ ] T199 [P] Create AdminController in backend/src/admin/admin.controller.ts with GET /admin/users, PUT /admin/users/:id/role, PUT /admin/users/:id/deactivate, GET /admin/stats endpoints
- [ ] T200 Add RolesGuard with 'admin' role to all admin endpoints
- [ ] T201 Register AdminModule in backend/src/app.module.ts

### Mobile - Admin Screens

- [ ] T202 [P] Create admin API service in mobile/src/services/api/admin.ts
- [ ] T203 [P] Create AdminDashboardScreen in mobile/src/screens/Admin/AdminDashboardScreen.tsx (admin only)
- [ ] T204 [P] Create UserManagementScreen in mobile/src/screens/Admin/UserManagementScreen.tsx (admin only)
- [ ] T205 Add admin navigation tab (visible only to admins) in mobile/src/navigation/AppNavigator.tsx

### Web - Admin Pages

- [ ] T206 [P] Create admin API service in web/src/services/api/admin.ts
- [ ] T207 [P] Create AdminDashboardPage in web/src/pages/Admin/AdminDashboardPage.tsx (admin only)
- [ ] T208 [P] Create UserManagementPage in web/src/pages/Admin/UserManagementPage.tsx (admin only)
- [ ] T209 Add admin routes (protected, admin only) to React Router in web/src/App.tsx
- [ ] T210 Add admin navigation menu item (visible only to admins)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T211 [P] Add loading spinners and skeletons to all mobile screens
- [ ] T212 [P] Add loading states and error boundaries to all web pages
- [ ] T213 [P] Implement pull-to-refresh on mobile list screens (plants, species, calendar)
- [ ] T214 [P] Add pagination to backend list endpoints (plants, species, users)
- [ ] T215 [P] Add pagination to mobile and web list views
- [ ] T216 [P] Add search/filter functionality to plant list (mobile and web)
- [ ] T217 [P] Add sorting options (by name, date added) to plant list
- [ ] T218 [P] Implement image optimization and lazy loading
- [ ] T219 [P] Add form validation error messages for all forms (mobile and web)
- [ ] T220 [P] Add success toast notifications for actions (plant added, watered, etc.)
- [ ] T221 [P] Add empty state UI for plant list, species search, calendar
- [ ] T222 [P] Implement offline indicator for mobile app
- [ ] T223 [P] Add database indexes for performance (userId, speciesId, nextWateringAt)
- [ ] T224 [P] Set up backend logging with Winston or Pino
- [ ] T225 [P] Add error tracking with Sentry (backend, mobile, web)
- [ ] T226 [P] Create database seed script with sample data (users, species, plants)
- [ ] T227 Update backend README.md with API documentation and setup instructions
- [ ] T228 Update mobile README.md with build and development instructions
- [ ] T229 Update web README.md with deployment instructions
- [ ] T230 [P] Add accessibility labels for screen readers (mobile and web)
- [ ] T231 [P] Test keyboard navigation on web app
- [ ] T232 Run quickstart.md validation (verify all setup steps work)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 4 - Auth (Phase 3)**: Depends on Foundational phase - BLOCKS other user stories
- **User Story 1 - Plants (Phase 4)**: Depends on US4 (Auth) completion
- **User Story 2 - Species (Phase 5)**: Depends on US4 (Auth) completion - Can run in parallel with US1
- **User Story 3 - Schedules (Phase 6)**: Depends on US1 (Plants) completion
- **Admin (Phase 7)**: Depends on US4 (Auth) completion - Can run in parallel with other stories
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 4 (Auth) - P1**: MUST complete first - All stories depend on authentication
- **User Story 1 (Plants) - P1**: Depends only on US4 (Auth) - Can start after auth complete
- **User Story 2 (Species) - P2**: Depends only on US4 (Auth) - Can run in parallel with US1
- **User Story 3 (Schedules) - P3**: Depends on US4 (Auth) AND US1 (Plants) - Needs plants to exist

### Within Each User Story

- Backend implementation before frontend (API-first principle)
- Database entities and migrations first
- Services before controllers
- Controllers registered in app module
- Mobile and web can be implemented in parallel once API exists
- Core functionality before polish features

### Parallel Opportunities

**Phase 1 (Setup)**:
- T005, T006, T007 can run in parallel (initialize all three projects)
- T008, T009, T010 can run in parallel (configure linting for all projects)

**Phase 2 (Foundational)**:
- Backend foundation (T011-T018), Mobile foundation (T019-T025), Web foundation (T026-T031) can run in parallel IF worked on by different team members

**Within Each User Story Phase**:
- DTO/Interface tasks marked [P] can run in parallel (different files)
- Mobile and Web implementations can run in parallel once backend API is complete
- Component creation tasks marked [P] can run in parallel (different components)

### MVP Strategy

**Recommended MVP Scope**: User Story 4 (Auth) + User Story 1 (Plants) only

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 4 (Auth)
4. Complete Phase 4: User Story 1 (Plants)
5. **STOP and VALIDATE**: Test authentication and plant management end-to-end
6. Deploy MVP for user feedback

**Full MVP**: Add User Story 2 (Species) and User Story 3 (Schedules) after validating core functionality.

---

## Parallel Example: User Story 1 (Plants)

```bash
# Backend entities and DTOs (can run in parallel):
Task T077: Create Plant entity
Task T080: Create CreatePlantDto
Task T081: Create UpdatePlantDto
Task T082: Create PlantResponse interface

# Once backend API is complete, frontend work (can run in parallel):
Mobile Team:
  Task T091-T097: Create all plant screens and components

Web Team:
  Task T102-T108: Create all plant pages and components
```

---

## Implementation Strategy

### MVP First (Authentication + Plants Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T031) → Foundation ready
3. Complete Phase 3: User Story 4 - Auth (T032-T076)
4. **STOP and TEST**: Verify authentication works end-to-end (register, login, profile)
5. Complete Phase 4: User Story 1 - Plants (T077-T110)
6. **STOP and VALIDATE**: Test complete MVP flow (register → login → add plant → view → edit → delete)
7. Deploy MVP and gather user feedback

### Incremental Delivery

1. MVP (Auth + Plants) → Test independently → Deploy
2. Add User Story 2 (Species) → Test independently → Deploy
3. Add User Story 3 (Schedules) → Test independently → Deploy
4. Add Admin functionality → Test independently → Deploy
5. Polish phase → Comprehensive testing → Final deployment

### Parallel Team Strategy

With multiple developers:

1. **Setup**: Team completes together (or tech lead does solo)
2. **Foundational**:
   - Developer A: Backend foundation (T011-T018)
   - Developer B: Mobile foundation (T019-T025)
   - Developer C: Web foundation (T026-T031)
3. **User Story 4 (Auth)**:
   - Developer A: Backend auth (T032-T052)
   - Developer B: Mobile auth (T053-T065) - starts after backend API ready
   - Developer C: Web auth (T066-T076) - starts after backend API ready
4. **After Auth Complete**:
   - Developer A: Backend plants (T077-T090)
   - Developer A2: Backend species (T111-T126) in parallel
   - Developer B: Mobile plants (T091-T101) - starts after backend plants API ready
   - Developer C: Web plants (T102-T110) - starts after backend plants API ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend APIs must be complete before starting frontend work (API-first principle)
- Mobile and web can proceed in parallel once APIs exist
- Tests are optional for MVP - focus on implementation first

---

## Task Summary

**Total Tasks**: 232
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 21 tasks
- Phase 3 (US4 - Auth): 45 tasks
- Phase 4 (US1 - Plants): 34 tasks
- Phase 5 (US2 - Species): 37 tasks
- Phase 6 (US3 - Schedules): 50 tasks
- Phase 7 (Admin): 13 tasks
- Phase 8 (Polish): 22 tasks

**Parallel Opportunities**: ~80 tasks marked [P] (can run in parallel within their phase)

**MVP Scope** (Auth + Plants only):
- Setup: 10 tasks
- Foundational: 21 tasks
- US4 (Auth): 45 tasks
- US1 (Plants): 34 tasks
- **Total MVP: 110 tasks**

**Independent Test Criteria**:
- ✅ US4 (Auth): Users can register, login, manage profile
- ✅ US1 (Plants): Users can add, view, edit, delete plants with photos
- ✅ US2 (Species): Users can search and view care info; experts can manage species
- ✅ US3 (Schedules): Users can create schedules, receive notifications, track watering
