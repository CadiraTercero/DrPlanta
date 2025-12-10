# Feature Specification: Water Calendar

**Feature Branch**: `002-water-calendar`
**Created**: 2025-12-09
**Status**: Draft
**Dependencies**: 001-plant-management-mvp (requires Plant entity and PlantSpecies catalog)

## Overview

The Water Calendar feature provides users with an automated water check scheduling system based on their plants' species water preferences. Users can view scheduled water checks in a monthly calendar, manage overdue tasks, and track their plant watering activities.

## User Scenarios & Testing

### User Story: Water Calendar Management

As an end user, I want a calendar-based water check system that automatically schedules when I should check if my plants need watering based on their species' water preferences, so I can maintain a consistent care routine and prevent over or under-watering.

**Why this feature**: Consistent watering is critical to plant health, but remembering when each plant needs attention is challenging with multiple plants of different species. This feature automates the scheduling based on plant science (species water preferences) and provides a centralized calendar view.

**Independent Test**: A user adds a plant with HIGH water preference and acquisition date of January 1st, the system schedules the first water check for January 5th (4 days after acquisition). User views the calendar, marks the plant as watered on January 5th, and sees the next check automatically scheduled for January 9th (4 days later). If user marks plant as "not ready yet", the check is postponed by 2 days.

**Acceptance Scenarios**:

#### Water Event Creation & Scheduling

1. **Given** a user adds a new plant with species that has HIGH water preference, **When** the plant is saved, **Then** the system creates the first water check event 4 days after the plant's acquisition date
2. **Given** a user adds a new plant with species that has MEDIUM water preference, **When** the plant is saved, **Then** the system creates the first water check event 14 days after the plant's acquisition date
3. **Given** a user adds a new plant with species that has LOW water preference, **When** the plant is saved, **Then** the system creates the first water check event 30 days after the plant's acquisition date
4. **Given** a user adds a new plant without a species assigned, **When** the plant is saved, **Then** the system creates the first water check event 14 days after acquisition date (default MEDIUM preference)

#### Calendar View & Navigation

5. **Given** a user navigates to the Calendar tab, **When** the screen loads, **Then** they see the current month's calendar view with navigation controls for previous/next months
6. **Given** the calendar displays the current month, **When** a day has one or more water check events, **Then** that day shows a water drop icon indicator
7. **Given** a user views the calendar, **When** they click on a day with water check events, **Then** the plants needing checks for that day appear in a detail panel above the calendar
8. **Given** a user views the calendar, **When** they click on a day without water check events, **Then** no detail panel appears or an empty state message is shown

#### Overdue Water Checks

9. **Given** a user has water check events scheduled in the past that weren't marked as completed, **When** they view the Calendar screen, **Then** all overdue checks appear in a "Pending Tasks" list above the calendar
10. **Given** a user views pending tasks, **When** they mark an overdue plant as watered or postponed, **Then** it is removed from the pending list and the next check is scheduled

#### Marking Water Events

11. **Given** a user views a day's water check details showing plant name, photo, and location, **When** they mark a plant as "watered", **Then** the current event is completed and the next event is automatically created based on the species' base interval (4/14/30 days)
12. **Given** a user views a day's water check details, **When** they mark a HIGH water preference plant as "not ready yet", **Then** the check is postponed by 2 days
13. **Given** a user views a day's water check details, **When** they mark a MEDIUM water preference plant as "not ready yet", **Then** the check is postponed by 5 days
14. **Given** a user views a day's water check details, **When** they mark a LOW water preference plant as "not ready yet", **Then** the check is postponed by 10 days
15. **Given** multiple plants need checking on the same day, **When** the user views that day, **Then** each plant can be marked individually (watered or postponed) independent of the others

#### Species Changes & Event Recalculation

16. **Given** a user has a plant with existing future water check events, **When** they change the plant's species to one with a different water preference, **Then** all future (not past) events are recalculated using the new species' intervals
17. **Given** a user changes a plant's species from MEDIUM to HIGH preference, **When** the update is saved, **Then** the next scheduled check date is recalculated to be 4 days from the last watered/checked date instead of 14 days

#### Empty States

18. **Given** a user has no plants in their garden, **When** they view the Calendar tab, **Then** they see an empty state message prompting them to add plants to get started
19. **Given** a user has plants but no water checks scheduled for the current month, **When** they view the Calendar, **Then** the month displays with no water drop indicators and a message indicating no checks this month

---

## Water Check Intervals

The system uses the plant species' `waterPreference` field from the plant-species catalog to determine check intervals:

| Water Preference | Check Interval | Postpone Interval (Not Ready Yet) |
|-----------------|----------------|-----------------------------------|
| HIGH            | Every 4 days   | +2 days                          |
| MEDIUM          | Every 14 days  | +5 days                          |
| LOW             | Every 30 days  | +10 days                         |
| No Species      | Every 14 days (default) | +5 days (default MEDIUM) |

### Initial Water Event Creation

When a plant is first added to the system:

1. **The system uses the plant's acquisition date** (the date the user purchased or received the plant) as the baseline for scheduling
2. **The first water check is scheduled** by adding the check interval days to the acquisition date:
   - If acquisition date is `January 1, 2025` and water preference is HIGH (4 days)
   - First water check will be scheduled for `January 5, 2025`
3. **If no acquisition date is provided**, the system defaults to using the current date (the date the plant was added to the app)
4. **Subsequent water checks** are calculated from the completion date of the previous check, maintaining the regular interval

## Edge Cases

- **What happens if a user deletes a plant with scheduled water events?**
  - All future water events for that plant are automatically deleted

- **What happens if a user marks a water check on a date different from the scheduled date?**
  - The event is marked as completed on the actual date the user marked it, and the next event calculates from the scheduled date (not the marked date) to maintain consistent intervals

- **What happens if a user changes a plant's acquisition date?**
  - All future water events are recalculated from the new acquisition date

- **What happens if the user navigates to a future month in the calendar?**
  - The calendar displays future scheduled water checks with water drop indicators on the appropriate days

- **What happens if a water check event is more than 30 days overdue?**
  - It remains in the pending tasks list until the user marks it as watered or postponed

- **What happens if two plants have the same name and location?**
  - Each is displayed separately in the day's detail panel with their individual photos to differentiate them

## Data Model

### WaterEvent Entity

```typescript
interface WaterEvent {
  id: string;
  plantId: string;           // Foreign key to Plant
  scheduledDate: Date;       // The date this check is scheduled for
  status: 'PENDING' | 'WATERED' | 'POSTPONED' | 'SKIPPED';
  completedDate?: Date;      // When user actually marked it (if completed)
  createdAt: Date;
  updatedAt: Date;
}
```

### Plant Entity Updates

No changes required to the Plant entity. The system uses the existing `species.waterPreference` field and `acquisitionDate` field.

## UI/UX Requirements

### Calendar Tab
- **Position**: Fourth tab in bottom navigation (after Home, Garden, Profile)
- **Icon**: Plant with water drop
- **Label**: "Calendar"

### Calendar View Components

1. **Pending Tasks Section** (above calendar)
   - Only visible when overdue events exist
   - Shows list of overdue plants with:
     - Plant photo (thumbnail)
     - Plant name
     - Location
     - Days overdue (e.g., "3 days overdue")
     - Two action buttons: "Watered" and "Not Ready Yet"

2. **Month Navigation**
   - Current month/year display (e.g., "December 2025")
   - Previous month button (<)
   - Next month button (>)

3. **Calendar Grid**
   - 7-column grid (Sun-Sat or Mon-Sun based on locale)
   - Each day cell shows:
     - Day number
     - Water drop icon if water checks scheduled
     - Visual indicator for today's date
   - Tappable day cells

4. **Day Detail Panel** (appears above calendar when day selected)
   - Title: "Water Checks for [Date]"
   - List of plants needing checks:
     - Plant photo (medium size)
     - Plant name (bold)
     - Location (secondary text)
     - Two action buttons: "Watered" and "Not Ready Yet"
   - Close/collapse button

## API Endpoints

### Water Events

- `POST /api/v1/water-events` - Create water event (auto-triggered on plant creation)
- `GET /api/v1/water-events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get events for date range
- `GET /api/v1/water-events/overdue` - Get all overdue events for current user
- `PATCH /api/v1/water-events/:id/complete` - Mark event as watered or postponed
  - Body: `{ status: 'WATERED' | 'POSTPONED', completedDate: Date }`
- `DELETE /api/v1/water-events/:id` - Delete water event

### Business Logic

- **When plant is created**: Auto-create first water event scheduled for `acquisitionDate + checkInterval` days
  - Example: Plant with HIGH preference and acquisition date `2025-01-01` → First event scheduled for `2025-01-05`
  - If no acquisition date provided, use current date as baseline
- **When event marked as WATERED**: Create next event based on base interval (4/14/30 days) from completion date
- **When event marked as POSTPONED**: Create new pending event based on postpone interval (2/5/10 days) from completion date
- **When plant species changes**: Recalculate all future (not past) events using new species' intervals
- **When plant is deleted**: Cascade delete all its water events

## Non-Functional Requirements

- **Performance**: Calendar month view should load within 500ms
- **Data Integrity**: Event creation must be atomic with plant creation
- **Scalability**: System should handle users with 100+ plants efficiently
- **Offline Support**: Calendar should cache current month's events for offline viewing

## Success Metrics

- 80% of users with plants access the Calendar tab at least once per week
- 60% of scheduled water checks are marked as completed within 2 days of scheduled date
- Average time from viewing calendar to marking event: < 30 seconds

## Future Enhancements

- Push notifications for water check reminders
- Watering history chart/analytics
- Custom intervals (override species defaults)
- Bulk actions (mark multiple plants as watered)
- Notes on water events (e.g., "soil still moist")
