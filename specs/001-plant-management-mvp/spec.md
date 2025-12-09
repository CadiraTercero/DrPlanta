# Feature Specification: Plant Management MVP

**Feature Branch**: `001-plant-management-mvp`
**Created**: 2025-12-07
**Status**: Draft
**Input**: User description: "Plant management MVP with user plant registry, plant information/FAQ system, and watering calendar features"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - My Garden: Register and Track Personal Plants (Priority: P1)

As an end user, I want a dedicated space called "My Garden" where I can register and manage my houseplants, so I can keep track of what plants I own, where they are located, and when I acquired them. In My Garden, I should be able to add new plants with their common name, species, location in my home, optionally upload photos, view all my plants at a glance, and access detailed information about each one.

**Why this priority**: This is the foundational feature - users cannot manage plants they haven't registered. Without this, no other feature provides value. "My Garden" serves as the central hub for the user's personal plant collection.

**Independent Test**: A user can create an account, navigate to "My Garden", add their first plant with a name and location, view it in their garden, and edit or delete it. The system persists this data across sessions.

**Acceptance Scenarios**:

1. **Given** a logged-in user with no plants, **When** they navigate to "My Garden", **Then** they see an empty state with a prominent "Add Plant" button
2. **Given** a user clicks "Add Plant", **When** they search for a plant species using partial text (e.g., "mons" or "MONS"), **Then** the system returns matching species searching case-insensitively in both commonName and latinName fields
3. **Given** a user has searched for a plant species, **When** they select a species from the search results, **Then** the species is linked to their plant and pre-fills available information
4. **Given** a user is adding a plant, **When** they select an acquisition date, **Then** a calendar picker appears allowing them to choose the date visually
5. **Given** a user is adding a plant, **When** they upload a photo of their plant, **Then** the image is uploaded and associated with the plant record
6. **Given** a user completes the add plant form with name "Monstera", species selection, location "Living Room", acquisition date, and photo, **Then** the plant appears in My Garden with all the correct details
7. **Given** a user has added plants to My Garden, **When** they view My Garden, **Then** they see all their registered plants displayed as cards/tiles with names, photos, and locations
8. **Given** a user viewing My Garden, **When** they select a specific plant, **Then** they see detailed information including their custom data (name, location, acquisition date, notes, photos) AND the linked plant species information (care requirements, light preference, water preference, humidity, toxicity, difficulty, description)
9. **Given** a user viewing a plant's details with a linked species, **When** they view the plant species section, **Then** they see comprehensive care information: light preference, water preference, humidity preference, toxicity warnings, difficulty level, tags, description, and care notes
10. **Given** a user viewing a plant's details, **When** they edit the plant's name, location, or other custom fields, **Then** the changes are saved and reflected immediately in My Garden
11. **Given** a user viewing My Garden, **When** they search or filter plants by name or location, **Then** the displayed plants update to match the criteria
12. **Given** a user has registered plants in My Garden, **When** they delete a plant, **Then** the plant is removed from My Garden and all associated data is deleted

---

### User Story 2 - Access Plant Care Information and FAQs (Priority: P2)

As an end user, I want to access expert-curated information about plant species including care instructions, common problems, and frequently asked questions, so I can learn how to properly care for my plants. As an expert user, I want to create and maintain this plant information database so end users have accurate, helpful guidance.

**Why this priority**: Once users have registered their plants, they need guidance on how to care for them. This provides educational value and helps users succeed with their plants, which is core to the app's mission.

**Independent Test**: An expert can create plant species information with care instructions and FAQs. An end user can search for their plant species, view the detailed care guide, and browse FAQs to find answers to common questions.

**Acceptance Scenarios**:

1. **Given** an expert user is logged in, **When** they create a new plant species entry with name, care instructions, light requirements, and watering needs, **Then** the information is saved and visible to all end users
2. **Given** an expert has created plant species information, **When** they add FAQ entries with questions and answers, **Then** the FAQs are associated with that species and visible to users
3. **Given** plant information exists in the system, **When** an end user searches for a plant by common name or scientific name, **Then** they see matching plant species with summaries
4. **Given** an end user has found a plant species, **When** they view its details, **Then** they see comprehensive care instructions including light, water, temperature, humidity, soil, and fertilizer requirements
5. **Given** an end user is viewing plant species details, **When** they scroll to the FAQ section, **Then** they see a list of common questions and answers relevant to that plant
6. **Given** an expert viewing plant species they created, **When** they edit care instructions or FAQs, **Then** the updates are immediately available to all users
7. **Given** an end user viewing their registered plant, **When** they request to see care information, **Then** the system links them to the relevant plant species information (if available)

---

### User Story 3 - Create and Manage Watering Schedules (Priority: P3)

As an end user, I want to set watering schedules for my plants and receive reminders so I don't forget to water them and can keep them healthy. I should be able to customize the watering frequency for each plant based on its needs.

**Why this priority**: With plants registered and care information available, users need help remembering to water their plants consistently. This provides practical daily value and helps prevent plant neglect.

**Independent Test**: A user can set a watering schedule for a registered plant (e.g., every 3 days), receive notifications when watering is due, mark plants as watered, and view watering history. The system tracks watering events over time.

**Acceptance Scenarios**:

1. **Given** a user has registered a plant, **When** they create a watering schedule with frequency "every 7 days", **Then** the schedule is saved and the next watering date is calculated
2. **Given** a user has set a watering schedule, **When** the scheduled watering time arrives, **Then** the user receives a notification reminding them to water that specific plant
3. **Given** a user receives a watering reminder, **When** they mark the plant as watered, **Then** the system records the watering event and schedules the next reminder based on the frequency
4. **Given** a user viewing their plant's details, **When** they check the watering history, **Then** they see a log of past watering dates and can track their care consistency
5. **Given** a user has multiple plants with different schedules, **When** they view their watering calendar, **Then** they see all upcoming watering tasks organized by date
6. **Given** a user wants to adjust care frequency, **When** they edit a plant's watering schedule to "every 10 days", **Then** future reminders are rescheduled accordingly
7. **Given** a user is away and cannot water on schedule, **When** they snooze a watering reminder, **Then** they can specify when to be reminded again
8. **Given** a user has watered a plant early or late, **When** they manually log a watering event with a custom date, **Then** the schedule adjusts and the next reminder calculates from that date

---

### User Story 4 - User Authentication and Account Management (Priority: P1)

As a user (end user, administrator, or expert), I want to create an account and log in securely so my plant data is private and accessible only to me, and so the system can enforce role-based permissions.

**Why this priority**: Authentication is foundational infrastructure required for all other features. Without it, we cannot distinguish users, protect data, or enforce role-based access control (a NON-NEGOTIABLE principle).

**Independent Test**: A new user can register with email and password, log in with their credentials, access their account, and log out. Administrators can assign roles during account creation.

**Acceptance Scenarios**:

1. **Given** a new visitor to the application, **When** they register with email, password, and display name, **Then** an account is created with "end user" role by default
2. **Given** a user has created an account, **When** they log in with correct email and password, **Then** they are authenticated and directed to their dashboard
3. **Given** a user has entered incorrect credentials, **When** they attempt to log in, **Then** they receive an error message and remain unauthenticated
4. **Given** an authenticated user, **When** they log out, **Then** their session ends and they cannot access protected features
5. **Given** an administrator creating a new user account, **When** they assign the "expert" or "administrator" role, **Then** that user has role-appropriate permissions
6. **Given** a user has forgotten their password, **When** they request a password reset, **Then** they receive instructions to create a new password
7. **Given** an authenticated user, **When** they update their profile information (name, email), **Then** the changes are saved and reflected in their account

---

### Edge Cases

- What happens when a user tries to access My Garden without being authenticated?
- What happens when a user tries to register a plant in My Garden without providing a name (required field)?
- What happens when a user navigates to My Garden and has no plants (empty state)?
- What happens when a user tries to view plant details for a plant that belongs to another user?
- What happens when a user searches/filters in My Garden with no matching results?
- What happens when a user uploads multiple photos exceeding the 5-photo limit per plant?
- What happens when a user searches for plant species and no matches are found?
- What happens when a user searches for plant species with very short query (1-2 characters)?
- What happens when a user adds a plant without selecting a species (species should be optional)?
- What happens when a user views plant details for a plant with no linked species (should gracefully hide species section)?
- What happens when plant species search returns many results (pagination/limiting)?
- What happens when a user uploads a photo during plant creation but the upload fails?
- What happens when a user selects a future date in the acquisition date calendar picker?
- What happens when an expert tries to create duplicate plant species entries with the same scientific name?
- What happens when a user sets an invalid watering frequency (e.g., 0 days or negative number)?
- What happens when a watering reminder is due but the user is offline (mobile app)?
- What happens when an expert deletes or edits plant species information that users have linked to their registered plants in My Garden?
- What happens when a user uploads an image file that is too large or in an unsupported format?
- What happens when a user tries to access administrator or expert features without the appropriate role?
- What happens when the plant species database is empty and users search for information?
- What happens when a user deletes their account - should their My Garden data be retained or purged?

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Authorization
- **FR-001**: System MUST allow users to register with email address, password, and display name
- **FR-002**: System MUST authenticate users via email and password login
- **FR-003**: System MUST support three distinct user roles: end user, administrator, and expert
- **FR-004**: System MUST enforce role-based access control at the API level
- **FR-005**: System MUST allow users to reset their password via email verification
- **FR-006**: System MUST allow users to update their profile information (name, email, password)
- **FR-007**: System MUST maintain user sessions across page refreshes and app restarts (until logout)

#### My Garden - Plant Registry
- **FR-008**: End users MUST have access to a "My Garden" space that displays all their registered plants
- **FR-009**: End users MUST be able to add plants to My Garden with name (required), species selection (via search), location, acquisition date (via calendar picker), photo upload, and notes
- **FR-009a**: System MUST provide a searchable species selector in the add plant form that searches plant-species database
- **FR-009b**: Plant species search MUST be case-insensitive and support partial matching
- **FR-009c**: Plant species search MUST search in both commonName and latinName fields
- **FR-009d**: Plant species search MUST return results as user types (autocomplete/typeahead pattern)
- **FR-009e**: System MUST provide a date picker (calendar UI component) for selecting acquisition date
- **FR-009f**: System MUST allow users to upload a plant photo during plant creation
- **FR-010**: End users MUST be able to upload and manage photos for their registered plants
- **FR-011**: System MUST support multiple photos per plant (minimum 5 photos per plant)
- **FR-012**: My Garden MUST display plants as cards/tiles showing plant name, primary photo (if available), and location
- **FR-013**: My Garden MUST show an empty state with "Add Plant" call-to-action when user has no plants
- **FR-014**: End users MUST be able to search/filter plants in My Garden by name or location
- **FR-015**: End users MUST be able to view detailed information for each plant by selecting it from My Garden
- **FR-016**: Plant detail view MUST show user's custom plant data: name, location, acquisition date, photos, notes, and care history
- **FR-016a**: Plant detail view MUST display linked plant species information when available: commonName, latinName, light preference, water preference, humidity preference, toxicity, difficulty, tags, shortDescription, and care notes
- **FR-016b**: Plant species information MUST be visually distinguished from user's custom plant data in the detail view
- **FR-017**: End users MUST be able to edit any information for their registered plants from the detail view
- **FR-018**: End users MUST be able to delete plants from My Garden
- **FR-019**: System MUST ensure users can only view and modify their own plants (data isolation)

#### Plant Information & FAQ
- **FR-016**: Expert users MUST be able to create plant species entries with common name, scientific name, care instructions, and description
- **FR-017**: Expert users MUST be able to specify care requirements including light, water, temperature, humidity, soil type, and fertilizer needs for each species
- **FR-018**: Expert users MUST be able to add, edit, and delete FAQ entries for each plant species
- **FR-019**: End users MUST be able to search for plant species by common name or scientific name
- **FR-020**: End users MUST be able to view complete care information for any plant species
- **FR-021**: End users MUST be able to browse FAQs for any plant species
- **FR-022**: System MUST allow end users to link their registered plants to plant species entries in the information database
- **FR-023**: Expert users MUST be able to edit and update existing plant species information
- **FR-024**: System MUST track which expert created or last modified each plant species entry (audit trail)

#### Watering Schedules & Reminders
- **FR-025**: End users MUST be able to create watering schedules for their registered plants with custom frequency (days between watering)
- **FR-026**: System MUST calculate next watering date based on last watering date and frequency
- **FR-027**: System MUST send notifications to users when plants are due for watering
- **FR-028**: End users MUST be able to mark plants as watered, which records the event and schedules the next reminder
- **FR-029**: End users MUST be able to manually log watering events with custom dates
- **FR-030**: End users MUST be able to view watering history for each plant showing dates and frequency
- **FR-031**: End users MUST be able to view a calendar or list of all upcoming watering tasks across their collection
- **FR-032**: End users MUST be able to edit watering schedule frequency at any time
- **FR-033**: End users MUST be able to snooze watering reminders to a future date
- **FR-034**: System MUST support notification delivery on both mobile and web platforms

#### Administrator Functions
- **FR-035**: Administrator users MUST be able to view all user accounts
- **FR-036**: Administrator users MUST be able to assign or change user roles (end user, expert, administrator)
- **FR-037**: Administrator users MUST be able to deactivate user accounts (soft delete)
- **FR-038**: Administrator users MUST be able to view platform usage statistics (total users, total plants, total species)

#### Data Management
- **FR-039**: System MUST allow end users to export their plant collection data in a standard format (JSON or CSV)
- **FR-040**: System MUST persist all user data (plants, schedules, watering history) across sessions
- **FR-041**: System MUST validate all user inputs and reject invalid data with clear error messages
- **FR-042**: System MUST handle image uploads with file size limits (max 10MB per image) and format validation (JPEG, PNG)

### Key Entities

- **User**: Represents any system user with email, password hash, display name, role (end user/expert/administrator), creation date, and authentication tokens. Related to plants (one-to-many for end users).

- **Plant**: Represents a user's registered houseplant with name, optional species reference, location, acquisition date, notes, photos (array), owner (user reference), watering schedule reference, and creation/update timestamps.

- **PlantSpecies**: Represents expert-curated plant information with UUID id, common name (unique), Latin/scientific name, short description (1-3 sentences), care preferences (light preference: LOW/MEDIUM/HIGH, water preference: LOW/MEDIUM/HIGH, humidity preference: LOW/MEDIUM/HIGH), difficulty level (EASY/MEDIUM/HARD), toxicity level (NON_TOXIC/TOXIC_PETS/TOXIC_HUMANS/TOXIC_PETS_AND_HUMANS), recommended for indoor (boolean), tags (array), optional care notes, and timestamps (created at, updated at). Database includes 47 pre-seeded common houseplant species.

- **FAQ**: Represents a question and answer pair associated with a plant species, with question text, answer text, plant species reference, and creation date.

- **WateringSchedule**: Represents a watering routine for a specific plant with plant reference, frequency (days), last watered date, next watering date, snooze date (optional), active status, and creation date.

- **WateringEvent**: Represents a recorded watering action with plant reference, watered date, logged by user, optional notes, and creation timestamp. Forms watering history.

- **Notification**: Represents a system notification (primarily watering reminders) with recipient user, notification type, related plant reference, scheduled delivery time, delivered status, read status, and creation date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can register an account, log in, navigate to My Garden, add their first plant, and view it displayed in My Garden in under 3 minutes
- **SC-002**: Users can find plant care information by searching for a common plant name and view complete care instructions in under 30 seconds
- **SC-003**: Users can set up a watering schedule for a plant and receive a test notification within 1 minute (for validation)
- **SC-004**: System handles 100 concurrent users without performance degradation (response times under 2 seconds)
- **SC-005**: 90% of users successfully complete their first plant registration in My Garden on the first attempt without errors
- **SC-006**: Mobile app users can access My Garden and view plant details while offline (cached data)
- **SC-007**: Users receive watering reminder notifications with 95% reliability (delivered within 1 hour of scheduled time)
- **SC-008**: Expert users can create a new plant species entry with care instructions and FAQs in under 10 minutes
- **SC-009**: Plant species search returns relevant results for common plant names with 90% accuracy
- **SC-010**: Users successfully link their registered plants to species information in 80% of cases where matching species exist
- **SC-011**: User data export completes in under 10 seconds for collections up to 100 plants
- **SC-012**: System maintains 99% uptime during business hours (8am-8pm user local time)
- **SC-013**: Image uploads complete successfully for images under 10MB with 95% success rate
- **SC-014**: Users can view watering history for any plant showing at least the last 20 watering events

## Assumptions

- Users primarily access the mobile app while physically near their plants, so mobile experience is prioritized
- Most users will have between 5-50 plants in their collection
- Plant species database will start with 100-500 common houseplant species
- Users expect notifications to arrive within 1 hour of scheduled time (not real-time to the minute)
- Photo storage will use cloud storage service (e.g., AWS S3, Cloudinary)
- Authentication uses industry-standard JWT tokens with reasonable expiration (7 days for mobile, 24 hours for web)
- Email functionality for password reset uses a transactional email service (e.g., SendGrid, Amazon SES)
- Watering frequency is measured in whole days (not hours or minutes)
- Users operate within reasonable timezones supported by standard timezone libraries
- Plant species information is moderated by experts before publication (no user-generated species content)
- System starts with English language only; internationalization is post-MVP
- Users consent to data collection and notification delivery as part of account registration
- Deleted plants are permanently removed (no soft delete for user plants, only for user accounts)

## Dependencies

- Third-party authentication library or service for secure password hashing and JWT management
- Push notification service for mobile (e.g., Firebase Cloud Messaging, Apple Push Notification Service)
- Cloud storage service for user-uploaded plant photos
- Transactional email service for password reset and account verification emails
- Timezone library for handling watering schedules across different user locations
- Background job scheduler for processing scheduled notifications (e.g., node-cron, Bull queue)

## Out of Scope (Post-MVP)

- Social features (sharing plants, following other users, community forums)
- Advanced plant health tracking (fertilizer schedules, pest tracking, growth measurements)
- Plant care reminders beyond watering (fertilizing, repotting, pruning)
- Integration with external plant identification services or APIs
- E-commerce features (buying plants, products, or services)
- Multi-language support and internationalization
- Plant species approval workflow (assume trusted experts for MVP)
- Bulk import of plant collections from CSV or other sources
- Advanced search and filtering (by care difficulty, light requirements, etc.)
- Automated watering schedule suggestions based on plant species
- Weather integration for adjusting watering schedules
- Plant care insights and analytics (e.g., "you water this plant more/less than similar plants")
- Family/household sharing (multiple users managing the same plant collection)
