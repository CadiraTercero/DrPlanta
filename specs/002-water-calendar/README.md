# Water Calendar Feature Specification

**Status**: Draft
**Created**: 2025-12-09
**Dependencies**: 001-plant-management-mvp

## Overview

The Water Calendar feature provides automated water check scheduling based on plant species water preferences. Users view scheduled checks in a monthly calendar, manage overdue tasks, and track their watering activities.

## Quick Links

- [Full Specification](./spec.md) - Complete user scenarios and acceptance criteria
- [Data Model](./data-model.md) - Database schema, entities, and business logic
- [Calendar Screen UX](./contracts/calendar-screen-ux.md) - Detailed UI/UX specifications

## Key Features

### Automated Scheduling
- Water check events auto-created when plants are added
- Intervals based on species water preference:
  - **HIGH**: Every 4 days
  - **MEDIUM**: Every 14 days (default)
  - **LOW**: Every 30 days

### Monthly Calendar View
- Visual calendar with water drop indicators
- Navigate between months
- Tap days to view scheduled checks
- Overdue tasks list above calendar

### Flexible Actions
- Mark plants as "Watered" → Next check scheduled automatically
- Mark as "Not Ready Yet" → Postpones check (2/5/10 days based on preference)
- Individual plant management

### Smart Updates
- Species changes recalculate all future events
- Plant deletion removes associated events
- Works with or without species assignment

## User Flow

```
1. User adds plant with species
   ↓
2. System schedules first check (from acquisition date)
   ↓
3. User views Calendar tab
   ↓
4. Sees water drop on scheduled day
   ↓
5. Taps day → Views plant details
   ↓
6. Marks as "Watered" or "Not Ready Yet"
   ↓
7. System schedules next check
```

## Navigation

**Tab Bar Position**: Fourth tab (after Home, Garden, Profile)
**Tab Label**: "Calendar"
**Tab Icon**: Plant with water drop

## Data Model Summary

### WaterEvent Entity
- `id`: UUID
- `plantId`: Foreign key to Plant
- `scheduledDate`: When to check
- `status`: PENDING | WATERED | POSTPONED | SKIPPED
- `completedDate`: When user actually marked it
- Timestamps: createdAt, updatedAt

### Relationships
- Plant (1) → (M) WaterEvent
- Cascade delete when plant deleted

## API Endpoints

```
GET    /api/v1/water-events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET    /api/v1/water-events/overdue
PATCH  /api/v1/water-events/:id/complete
DELETE /api/v1/water-events/:id
```

## Implementation Checklist

### Backend
- [ ] Create WaterEvent entity
- [ ] Create database migration
- [ ] Create water-events module with controller/service
- [ ] Implement auto-create on plant creation
- [ ] Implement event completion logic
- [ ] Implement recalculation on species change
- [ ] Add cascade delete on plant deletion
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend
- [ ] Create WaterEvent types
- [ ] Create water-event service
- [ ] Create CalendarScreen component
- [ ] Create PendingTasks component
- [ ] Create MonthNavigation component
- [ ] Create DayDetailPanel component
- [ ] Create CalendarGrid component
- [ ] Create WaterCheckCard component
- [ ] Add Calendar tab to navigation
- [ ] Add plant-with-drop icon asset
- [ ] Implement state management
- [ ] Add loading/error states
- [ ] Add empty states
- [ ] Test on iOS
- [ ] Test on Android

### Data Migration
- [ ] Create migration script for existing plants
- [ ] Test migration on staging data
- [ ] Run migration on production

## Testing Scenarios

### Priority 1 (Must Test)
1. Plant with HIGH preference schedules check 4 days after acquisition
2. Plant with MEDIUM preference schedules check 14 days after acquisition
3. Plant with LOW preference schedules check 30 days after acquisition
4. Plant without species defaults to 14 days
5. Marking plant as "Watered" schedules next check correctly
6. Marking plant as "Not Ready Yet" postpones correctly
7. Changing plant species recalculates future events
8. Deleting plant removes all its water events
9. Overdue events appear in pending tasks
10. Calendar shows water drops on correct days

### Priority 2 (Should Test)
- Multiple plants on same day can be marked individually
- Month navigation loads correct events
- Day detail panel opens/closes smoothly
- Empty states display correctly
- Error states handle gracefully
- Loading states appear appropriately

## Success Metrics

- 80% of users with plants access Calendar tab weekly
- 60% of checks marked complete within 2 days
- Average action time: < 30 seconds

## Future Enhancements

- Push notifications for reminders
- Watering history analytics
- Custom intervals (override species defaults)
- Bulk actions
- Notes on water events

## Questions?

Contact the team or refer to the detailed specification files linked above.
