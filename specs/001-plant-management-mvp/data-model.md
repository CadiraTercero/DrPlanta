# Data Model: Plant Management MVP

**Date**: 2025-12-07
**Feature**: Plant Management MVP
**Related**: [spec.md](./spec.md) | [plan.md](./plan.md) | [research.md](./research.md)

## Overview

This document defines the database schema, entity relationships, validation rules, and state transitions for the Plant Management MVP. The data model uses PostgreSQL with TypeORM and follows normalization principles while optimizing for query performance.

## Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│     User     │         │ PlantSpecies │
│ (id, email,  │         │ (id, names,  │
│  role, ...)  │         │  care, ...)  │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ creates (expert)       │
       │                        │
       │ owns                   │ references
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│    Plant     │─────────│     FAQ      │
│ (id, name,   │ links to│ (id, q, a,   │
│  photos,...) │         │  species_id) │
└──────┬───────┘         └──────────────┘
       │
       │ has
       ▼
┌────────────────┐       ┌────────────────┐
│WateringSchedule│       │ WateringEvent  │
│ (id, freq,     │───────│ (id, date,     │
│  next_date,...)│records│  plant_id,..   │
└────────┬───────┘       └────────────────┘
         │
         │ triggers
         ▼
┌────────────────┐
│  Notification  │
│ (id, type,     │
│  delivered,...)│
└────────────────┘
```

## Entities

### User

Represents all system users (end users, experts, administrators).

**Table**: `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| display_name | VARCHAR(100) | NOT NULL | User's display name |
| role | ENUM('end_user', 'expert', 'admin') | NOT NULL, DEFAULT 'end_user' | User role |
| expo_push_token | VARCHAR(255) | NULL | Expo push notification token (mobile only) |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Account active status (for soft delete) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_users_email` on `email` (for login lookups)
- `idx_users_role` on `role` (for admin user filtering)

**Validation Rules**:
- `email`: Valid email format (RFC 5322)
- `password`: Min 8 characters (enforced at application layer before hashing)
- `display_name`: 1-100 characters, no special characters except spaces, hyphens, apostrophes
- `role`: Must be one of defined enum values
- `expo_push_token`: Optional, valid Expo token format if provided

**Relationships**:
- One-to-many with `Plant` (user owns plants)
- One-to-many with `PlantSpecies` (expert creates species)
- One-to-many with `Notification` (user receives notifications)

**Security**:
- Never expose `password_hash` in API responses
- Use `is_active` for soft delete (preserve data for audit)
- Rotate JWT tokens on password change

---

### Plant

Represents a user's registered houseplant.

**Table**: `plants`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK (users.id), NOT NULL, ON DELETE CASCADE | Owner of the plant |
| species_id | UUID | FK (plant_species.id), NULL, ON DELETE SET NULL | Linked plant species |
| name | VARCHAR(100) | NOT NULL | Plant's custom name |
| location | VARCHAR(100) | NULL | Plant location (e.g., "Living Room") |
| acquisition_date | DATE | NULL | Date plant was acquired |
| notes | TEXT | NULL | User notes about the plant |
| photos | JSONB | NOT NULL, DEFAULT '[]' | Array of photo URLs/IDs |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_plants_user_id` on `user_id` (for user's plant list)
- `idx_plants_species_id` on `species_id` (for species usage tracking)

**JSONB Structure for `photos`**:
```json
[
  {
    "cloudinary_id": "plant_photos/abc123",
    "url": "https://res.cloudinary.com/...",
    "uploaded_at": "2025-12-07T10:00:00.000Z"
  }
]
```

**Validation Rules**:
- `name`: Required, 1-100 characters
- `location`: Optional, max 100 characters
- `acquisition_date`: Optional, must be in past or today
- `photos`: Max 5 photos per plant (enforced at application layer)
- `notes`: Optional, max 2000 characters

**Relationships**:
- Many-to-one with `User` (plant belongs to user)
- Many-to-one with `PlantSpecies` (plant links to species, optional)
- One-to-one with `WateringSchedule` (plant has a schedule)
- One-to-many with `WateringEvent` (plant has watering history)

**Business Rules**:
- User can only access/modify their own plants (enforce with user_id filter)
- Deleting plant cascades to schedule and events
- Deleting species sets `species_id` to NULL (preserve plant record)

---

### PlantSpecies

Represents expert-curated plant species information. Pre-seeded with 47 common houseplant species.

**Table**: `plant_species`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| commonName | VARCHAR(255) | UNIQUE, NOT NULL | Common plant name in English |
| latinName | VARCHAR(255) | NOT NULL | Scientific Latin name (e.g., "Monstera deliciosa") |
| lightPreference | ENUM('LOW', 'MEDIUM', 'HIGH') | NOT NULL | Light requirement level |
| waterPreference | ENUM('LOW', 'MEDIUM', 'HIGH') | NOT NULL | Water requirement level |
| humidityPreference | ENUM('LOW', 'MEDIUM', 'HIGH') | NOT NULL | Humidity requirement level |
| toxicity | ENUM('NON_TOXIC', 'TOXIC_PETS', 'TOXIC_HUMANS', 'TOXIC_PETS_AND_HUMANS') | NOT NULL | Toxicity classification |
| difficulty | ENUM('EASY', 'MEDIUM', 'HARD') | NOT NULL | Care difficulty level |
| recommendedIndoor | BOOLEAN | NOT NULL, DEFAULT true | Whether suitable for indoor environments |
| tags | TEXT (stored as simple-array) | NULL | Comma-separated descriptive tags (e.g., "flowering,succulent,hanging") |
| shortDescription | TEXT | NOT NULL | Brief description in 1-3 sentences |
| notes | TEXT | NULL | Additional care notes and warnings |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_species_common_name` on `commonName` (for search and unique constraint)
- Full-text search index on `commonName` and `latinName` (PostgreSQL `tsvector`)

**Validation Rules**:
- `commonName`: Required, unique, 1-255 characters
- `latinName`: Required, 1-255 characters, typically in format "Genus species"
- `lightPreference`, `waterPreference`, `humidityPreference`: Must be one of defined enum values (LOW/MEDIUM/HIGH)
- `toxicity`: Must be one of defined enum values
- `difficulty`: Must be one of defined enum values (EASY/MEDIUM/HARD)
- `recommendedIndoor`: Boolean, defaults to true
- `tags`: Optional, stored as comma-separated values
- `shortDescription`: Required, 1-3 sentences describing the plant
- `notes`: Optional, additional care instructions

**Relationships**:
- One-to-many with `Plant` (species linked to plants)
- One-to-many with `FAQ` (species has FAQs - to be implemented)

**Business Rules**:
- `commonName` must be unique (prevent duplicates)
- Pre-seeded with 47 common houseplant species on database initialization
- Future: Only experts and admins can create/edit species (authentication not yet enforced)
- Soft delete consideration: Mark as archived instead of deleting (preserve links)

**Implementation Notes**:
- TypeORM entity: [backend/src/plant-species/entities/plant-species.entity.ts](../../../backend/src/plant-species/entities/plant-species.entity.ts)
- Repository: [backend/src/plant-species/repositories/plant-species.repository.ts](../../../backend/src/plant-species/repositories/plant-species.repository.ts)
- Seed data: [specs/data/plant-species-catalog.json](../data/plant-species-catalog.json)
- JSON Schema: [specs/schemas/plant-species.schema.json](../schemas/plant-species.schema.json)

---

### FAQ

Represents frequently asked questions for a plant species.

**Table**: `faqs`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| species_id | UUID | FK (plant_species.id), NOT NULL, ON DELETE CASCADE | Related plant species |
| question | TEXT | NOT NULL | FAQ question |
| answer | TEXT | NOT NULL | FAQ answer |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | Order for display (lower first) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_faqs_species_id` on `species_id` (for fetching species FAQs)
- `idx_faqs_species_order` on `(species_id, display_order)` (for ordered fetching)

**Validation Rules**:
- `question`: Required, 1-500 characters
- `answer`: Required, 1-5000 characters
- `display_order`: Integer >= 0

**Relationships**:
- Many-to-one with `PlantSpecies` (FAQ belongs to species)

**Business Rules**:
- Only experts and admins can create/edit/delete FAQs
- Deleting species cascades to FAQs
- `display_order` allows custom ordering (default chronological)

---

### WateringSchedule

Represents a watering schedule for a specific plant.

**Table**: `watering_schedules`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| plant_id | UUID | FK (plants.id), UNIQUE, NOT NULL, ON DELETE CASCADE | Related plant |
| frequency_days | INTEGER | NOT NULL, CHECK (frequency_days > 0) | Days between watering |
| last_watered_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last watering timestamp |
| next_watering_at | TIMESTAMP | NOT NULL | Calculated next watering date |
| snoozed_until | TIMESTAMP | NULL | Snoozed notification date |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Schedule active status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_schedules_plant_id` on `plant_id` (unique, one schedule per plant)
- `idx_schedules_next_watering` on `next_watering_at` WHERE `is_active = true` (for notification job)
- `idx_schedules_user_calendar` on `plant_id` JOIN `plants.user_id` (for user's calendar view)

**Validation Rules**:
- `frequency_days`: Required, must be > 0, typically 1-365 days
- `last_watered_at`: Required, must be <= NOW()
- `next_watering_at`: Calculated as `last_watered_at + frequency_days`, must be > last_watered_at
- `snoozed_until`: Optional, if set must be > NOW()

**Relationships**:
- One-to-one with `Plant` (schedule belongs to one plant)
- One-to-many with `WateringEvent` (schedule records events)
- One-to-many with `Notification` (schedule triggers notifications)

**State Transitions**:
```
Initial State: is_active = true, next_watering_at = last_watered_at + frequency_days

Event: Water Plant
  → Record WateringEvent
  → last_watered_at = NOW()
  → next_watering_at = NOW() + frequency_days
  → snoozed_until = NULL

Event: Snooze Notification
  → snoozed_until = user_selected_date
  → (notification job skips until snoozed_until passes)

Event: Edit Frequency
  → frequency_days = new_value
  → next_watering_at = last_watered_at + new_frequency_days

Event: Deactivate Schedule
  → is_active = false
  → (no more notifications generated)
```

**Business Rules**:
- Only one schedule per plant (enforce with UNIQUE constraint)
- Deleting plant cascades to schedule
- `next_watering_at` auto-calculated on update
- Snoozed schedules still show in calendar but don't trigger notifications

---

### WateringEvent

Represents a recorded watering action.

**Table**: `watering_events`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| plant_id | UUID | FK (plants.id), NOT NULL, ON DELETE CASCADE | Related plant |
| schedule_id | UUID | FK (watering_schedules.id), NULL, ON DELETE SET NULL | Related schedule (if applicable) |
| watered_at | TIMESTAMP | NOT NULL | When plant was watered |
| notes | TEXT | NULL | Optional notes about watering |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Indexes**:
- `idx_events_plant_id` on `plant_id` (for plant history)
- `idx_events_watered_at` on `watered_at DESC` (for chronological queries)
- Composite index on `(plant_id, watered_at DESC)` (for plant's recent history)

**Validation Rules**:
- `watered_at`: Required, must be <= NOW(), must be > plant's creation date
- `notes`: Optional, max 500 characters

**Relationships**:
- Many-to-one with `Plant` (event belongs to plant)
- Many-to-one with `WateringSchedule` (event references schedule, optional)

**Business Rules**:
- Events are immutable (no updates after creation)
- Deleting plant cascades to events
- Display last 20 events per plant (pagination for more)
- Calculate watering consistency metrics (days between events)

---

### Notification

Represents system notifications (primarily watering reminders).

**Table**: `notifications`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK (users.id), NOT NULL, ON DELETE CASCADE | Recipient user |
| plant_id | UUID | FK (plants.id), NULL, ON DELETE CASCADE | Related plant (if applicable) |
| type | ENUM('watering_reminder', 'system') | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| body | TEXT | NOT NULL | Notification message |
| scheduled_for | TIMESTAMP | NOT NULL | When to deliver notification |
| delivered_at | TIMESTAMP | NULL | When notification was sent |
| is_delivered | BOOLEAN | NOT NULL, DEFAULT false | Delivery status |
| is_read | BOOLEAN | NOT NULL, DEFAULT false | Read status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Indexes**:
- `idx_notifications_user_id` on `user_id` (for user's notifications)
- `idx_notifications_scheduled` on `scheduled_for` WHERE `is_delivered = false` (for notification job)
- `idx_notifications_plant_id` on `plant_id` (for plant-related notifications)

**Validation Rules**:
- `title`: Required, max 255 characters
- `body`: Required, max 1000 characters
- `scheduled_for`: Required, typically NOW() for immediate or future for scheduled
- `delivered_at`: Set when notification sent, must be >= scheduled_for

**Relationships**:
- Many-to-one with `User` (notification sent to user)
- Many-to-one with `Plant` (notification references plant, optional)

**State Transitions**:
```
Initial State: is_delivered = false, is_read = false, delivered_at = NULL

Event: Notification Job Runs
  → Check scheduled_for <= NOW()
  → Send to Expo Push Notification API
  → delivered_at = NOW()
  → is_delivered = true

Event: User Opens Notification (mobile)
  → is_read = true

Event: User Dismisses Notification
  → is_read = true
```

**Business Rules**:
- Batch notifications daily (e.g., 8 AM user local time)
- Retry failed deliveries 3 times with exponential backoff
- Delete old notifications after 30 days (cleanup job)
- Allow users to disable notifications (user preference, not implemented in MVP)

---

## Database Migrations

### Migration Strategy

- Use TypeORM migrations for schema changes
- Never use `synchronize: true` in production
- Run migrations automatically on deployment
- Keep migrations small and focused
- Test migrations on staging before production

### Initial Migration

Create all tables in correct order (respecting foreign keys):
1. `users`
2. `plant_species`
3. `plants`
4. `watering_schedules`
5. `watering_events`
6. `notifications`
7. `faqs`

### Seed Data (Development)

**Implemented:**
- ✅ 47 common houseplant species pre-seeded in database (run via `npm run seed`)
- Species include diverse plants: Monstera, Pothos, Snake Plant, Fiddle Leaf Fig, etc.
- Each species includes care preferences, difficulty, toxicity, and descriptive information

**To be implemented:**
- Create sample users (1 end user, 1 expert, 1 admin)
- Create 3-5 FAQs per species
- Generate sample plants for end user
- Generate sample watering events

**Seed Command:**
```bash
cd backend && npm run seed
```

---

## Query Patterns

### Common Queries

**Get user's plants with species info:**
```sql
SELECT p.*, ps.common_name, ps.scientific_name
FROM plants p
LEFT JOIN plant_species ps ON p.species_id = ps.id
WHERE p.user_id = $1
ORDER BY p.created_at DESC;
```

**Get upcoming watering tasks for user:**
```sql
SELECT p.name, p.location, ws.next_watering_at, ws.frequency_days
FROM watering_schedules ws
JOIN plants p ON ws.plant_id = p.id
WHERE p.user_id = $1
  AND ws.is_active = true
  AND (ws.snoozed_until IS NULL OR ws.snoozed_until < NOW())
ORDER BY ws.next_watering_at ASC;
```

**Search plant species:**
```sql
SELECT id, common_name, scientific_name, description
FROM plant_species
WHERE LOWER(common_name) LIKE LOWER($1)
   OR LOWER(scientific_name) LIKE LOWER($1)
ORDER BY common_name ASC
LIMIT 20;
```

**Get plant watering history:**
```sql
SELECT watered_at, notes
FROM watering_events
WHERE plant_id = $1
ORDER BY watered_at DESC
LIMIT 20;
```

### Performance Considerations

- Use pagination for all list queries (default 20 items, max 100)
- Implement cursor-based pagination for large datasets
- Cache species data (read-heavy, infrequently updated)
- Use database views for complex aggregations if needed
- Monitor slow queries and add indexes as needed

---

## Data Integrity Rules

### Referential Integrity

- All foreign keys have appropriate `ON DELETE` actions:
  - `CASCADE`: Parent deletion removes children (plants → events)
  - `SET NULL`: Parent deletion nullifies reference (species → plants)
  - `RESTRICT`: Prevent deletion if children exist (user with plants)

### Application-Level Checks

- User can only access their own plants (filter by `user_id`)
- User can only access plants linked to their schedules
- Experts can edit any species, end users cannot
- Admins can perform all actions

### Audit Trail

- All tables have `created_at` and `updated_at` timestamps
- `plant_species` tracks `created_by` for expert accountability
- Consider adding `updated_by` in future for full audit

---

## Backup & Recovery

### Backup Strategy

- Automated daily backups (managed by hosting provider)
- Point-in-time recovery capability
- Test restore procedure quarterly
- Store backups in separate geographic region

### Data Retention

- User data: Retained until account deletion
- Deleted accounts: Soft delete for 30 days, then hard delete
- Watering events: Retained indefinitely (user data ownership)
- Notifications: Purged after 30 days (cleanup job)

---

## Next Steps

With data model defined, proceed to:
1. [contracts/](./contracts/) - Generate OpenAPI specifications based on these entities
2. [quickstart.md](./quickstart.md) - Developer setup guide including database initialization
