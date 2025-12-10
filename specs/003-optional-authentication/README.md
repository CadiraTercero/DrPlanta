# Optional Authentication (Guest Mode)

**Feature ID**: 003
**Status**: Draft
**Dependencies**: 001-plant-management-mvp, 002-water-calendar

## Quick Summary

This feature enables users to use DrPlantes without creating an account. All functionality works locally, and users can later register to sync their data to the cloud.

## Problem Statement

New users face friction when required to create an account before trying the app. Many potential users want to evaluate the app's value before committing to registration. Current implementation blocks app access without authentication, reducing conversion rates.

## Solution

Implement a "guest mode" that stores all data locally on the device using AsyncStorage. Users can:
- Skip login/registration with a "Skip for now" option
- Add plants, photos, and manage care schedules locally
- Later create an account to sync all their local data to the backend
- Continue using all app features identically whether authenticated or not

## Key Features

1. **Skip Authentication**: "Skip for now" option on login screen
2. **Local Storage**: Plants, photos, and care logs stored on device
3. **Full Functionality**: All features work identically in guest mode
4. **Seamless Sync**: One-tap sync when user creates account
5. **Bundled Catalog**: Plant species catalog bundled in app (works offline)
6. **Data Persistence**: Local data preserved until user registers or uninstalls

## User Flow

```
[App Launch]
     ↓
[Login/Register Screen]
     ↓ (Skip for now)
[Home Screen - Guest Mode]
     ↓
[Add Plants, Photos, Logs]
     ↓ (All stored locally)
[Profile → Sign Up to Sync]
     ↓
[Register Account]
     ↓
[Automatic Data Sync]
     ↓
[Authenticated Mode]
```

## Technical Approach

### Local Storage
- **Technology**: AsyncStorage (React Native)
- **Storage Keys**: Prefixed with `@drplantes_guest_*`
- **Data Format**: JSON-serialized objects with UUIDs

### Data Sync
- **Trigger**: User registration or manual sync from profile
- **Process**: Batch upload plants → photos → water events
- **ID Mapping**: Local UUIDs mapped to backend IDs
- **Retry Logic**: Failed items queued for retry

### Species Catalog
- **Bundled**: JSON file in `assets/data/`
- **Updates**: Background check for new versions from backend
- **Offline**: Fully functional with bundled version

## Files Modified

### Mobile App
- `src/context/AuthContext.tsx` - Add guest mode state and sync methods
- `App.tsx` - Add "Skip for now" option to auth screen
- `src/services/plant.service.ts` - Route to local storage in guest mode
- `src/services/care-log.service.ts` - Route to local storage in guest mode
- `src/services/photo.service.ts` - Handle local photo storage
- `src/services/species.service.ts` - Load bundled catalog
- `src/screens/ProfileScreen.tsx` - Add guest mode UI and sync button
- `assets/data/plant-species-catalog.json` - Bundle catalog

### Backend
- No changes required (uses existing endpoints)

## Success Metrics

- **Adoption**: 40%+ new users start in guest mode
- **Conversion**: 50%+ guest users create accounts within 14 days
- **Sync Success**: 90%+ successful data syncs
- **Data Loss**: < 5% data loss due to uninstalls before registration

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss on uninstall | High | Clear messaging in profile about backing up data |
| Sync failures | Medium | Robust retry logic, backup before sync |
| Storage limits | Low | Validate storage capacity, prompt to sync at thresholds |
| Catalog size | Low | Compress JSON, lazy load images |

## Implementation Phases

1. **Phase 1**: Authentication flow updates (skip option)
2. **Phase 2**: Local storage for plants
3. **Phase 3**: Local storage for photos and water events
4. **Phase 4**: Service layer routing (guest vs authenticated)
5. **Phase 5**: Bundle species catalog
6. **Phase 6**: Sync functionality
7. **Phase 7**: Profile screen guest mode UI
8. **Phase 8**: Testing and edge cases

**Estimated Timeline**: 2-3 weeks for full implementation

## Related Documents

- [spec.md](./spec.md) - Full feature specification with acceptance criteria
- [data-model.md](./data-model.md) - Detailed data structures and sync flow
- [../001-plant-management-mvp/spec.md](../001-plant-management-mvp/spec.md) - Plant management foundation
- [../002-water-calendar/spec.md](../002-water-calendar/spec.md) - Water event model

## Questions and Decisions

### Resolved
- **Q**: Should we remove login/register screens?
  - **A**: No, keep them with "Skip for now" option
- **Q**: What happens on app uninstall without registration?
  - **A**: Data loss is acceptable (user warned)
- **Q**: Should catalog be bundled or always fetched?
  - **A**: Bundle with background updates from backend
- **Q**: Allow registration later with data sync?
  - **A**: Yes, that's the core feature

### Open Questions
- None currently

## Notes

- Guest mode is local-first: all operations work offline
- Sync is one-way: local → backend (no merge conflicts in v1)
- Photos stored in device's file system, not AsyncStorage
- Species catalog version tracked for delta updates
- Backup created before sync attempts
