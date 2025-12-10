# Feature Specification: Optional Authentication (Guest Mode)

**Feature Branch**: `003-optional-authentication`
**Created**: 2025-12-10
**Status**: Draft
**Dependencies**: 001-plant-management-mvp, 002-water-calendar

## Overview

The Optional Authentication feature enables users to use DrPlantes without creating an account. Guest users can add plants, upload photos, manage care schedules, and use all app features locally. They can later create an account to sync their local data to the backend, ensuring data persistence across devices and app reinstalls.

## User Scenarios & Testing

### User Story: Guest Mode Usage

As a new user, I want to start using DrPlantes immediately without creating an account, so I can evaluate the app and start managing my plants right away without commitment. Later, when I'm confident in the app's value, I want to create an account to backup my data and access it from multiple devices.

**Why this feature**: Requiring authentication upfront creates friction for new users who want to quickly try the app. Allowing guest mode reduces barriers to entry while providing a clear upgrade path to authenticated accounts when users see value in data persistence and cross-device sync.

**Independent Test**: A user opens the app for the first time, taps "Skip for now" on the login screen, adds 3 plants with photos, logs watering activities for 2 weeks. Later, they create an account from the profile screen, and all their plants, photos, and care logs are synced to the backend. They can now uninstall/reinstall the app or use another device and see all their data.

**Acceptance Scenarios**:

#### Initial Authentication Flow

1. **Given** a user opens the app for the first time, **When** the authentication screen loads, **Then** they see Login and Register buttons plus a "Skip for now" option
2. **Given** a user taps "Skip for now", **When** the action completes, **Then** they are taken to the main app (Home tab) in guest mode
3. **Given** a user is in guest mode, **When** they navigate through the app, **Then** all features (add plants, upload photos, water calendar, view garden) work identically to authenticated users

#### Guest Mode Data Management

4. **Given** a user is in guest mode, **When** they add a plant with photo, **Then** the plant data and photo are stored locally on the device using AsyncStorage
5. **Given** a user is in guest mode, **When** they log watering activities, **Then** the care logs are stored locally on the device
6. **Given** a user is in guest mode, **When** they close and reopen the app, **Then** all their locally stored data (plants, photos, care logs) is still available
7. **Given** a user is in guest mode and uninstalls the app, **When** they reinstall it, **Then** all local data is lost (expected behavior, no warning required)

#### Profile Screen - Guest Mode

8. **Given** a user is in guest mode, **When** they navigate to the Profile tab, **Then** they see a "Guest Mode" indicator and a prominent "Sign Up to Sync Data" button
9. **Given** a user is in guest mode viewing their profile, **When** they tap "Sign Up to Sync Data", **Then** they are taken to the registration screen
10. **Given** a user is in guest mode, **When** they view their profile, **Then** they see information about local storage and benefits of creating an account (data backup, multi-device access)

#### Registration & Data Sync

11. **Given** a user in guest mode has 5 plants with photos and 20 care logs, **When** they complete registration, **Then** all local data is uploaded to the backend and the user is now authenticated
12. **Given** a user completes registration from guest mode, **When** the sync process starts, **Then** they see a progress indicator showing "Syncing your plants and data..."
13. **Given** a user's data sync is in progress, **When** all plants are uploaded, **Then** local photos are uploaded to the backend storage
14. **Given** a user's data sync is in progress, **When** all care logs are uploaded, **Then** the local storage is marked as synced and the user can use the app normally
15. **Given** a user has successfully synced guest data, **When** they log out and log back in, **Then** all their data is retrieved from the backend (not local storage)

#### Login from Guest Mode

16. **Given** a user is in guest mode with local data, **When** they tap "Already have an account? Log in" from the profile, **Then** they see a warning: "You have local data. After login, you can choose to sync it or keep your existing account data"
17. **Given** a user logs into an existing account from guest mode with local data, **When** login succeeds, **Then** they are asked: "You have local guest data. Do you want to sync it to your account or discard it?"
18. **Given** a user chooses to sync local data when logging in, **When** the sync completes, **Then** the local guest data is merged with their existing account data
19. **Given** a user chooses to discard local data when logging in, **When** they confirm, **Then** the local data is cleared and only their account data is displayed

#### Species Catalog Bundling

20. **Given** the app is installed for the first time, **When** a guest user searches for plant species, **Then** they can browse the complete catalog bundled with the app (no backend required)
21. **Given** a user opens the app with internet connectivity, **When** the app starts, **Then** it checks the backend for catalog updates and downloads new species data if available
22. **Given** a user is in offline mode, **When** they search for plant species, **Then** they can use the bundled catalog without any functionality loss

#### Edge Cases & Empty States

23. **Given** a user is in guest mode with no plants, **When** sync is triggered, **Then** the sync completes instantly with "No data to sync" message
24. **Given** a user's data sync fails due to network error, **When** the error occurs, **Then** the data remains in local storage and the user can retry sync later
25. **Given** a user is in guest mode, **When** they have more than 50 plants (edge case), **Then** sync should batch uploads to prevent timeout errors

---

## Technical Architecture

### Local Storage Strategy

**Technology**: AsyncStorage (React Native)

**Data Keys**:
- `@drplantes_guest_plants` - JSON array of guest plants
- `@drplantes_guest_photos` - JSON array of local photo file paths
- `@drplantes_guest_water_events` - JSON array of water events
- `@drplantes_is_guest_mode` - Boolean flag
- `@drplantes_guest_data_synced` - Boolean flag

**Data Structures**:

```typescript
// Local Plant Storage
interface LocalPlant {
  id: string;              // UUID generated locally
  name: string;
  nickname?: string;
  speciesId?: string;      // References bundled catalog
  acquisitionDate: Date;
  location?: string;
  photoPath?: string;      // Local file path
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Local Photo Storage
interface LocalPhoto {
  id: string;
  plantId: string;
  filePath: string;        // Local device path
  createdAt: Date;
}

// Local Water Event Storage
interface LocalWaterEvent {
  id: string;
  plantId: string;
  scheduledDate: Date;
  status: 'PENDING' | 'WATERED' | 'POSTPONED' | 'SKIPPED';
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Authentication Context Updates

**Current State**: AuthContext provides authentication state and user info
**Required Changes**: Add guest mode support

```typescript
interface AuthContextType {
  // Existing
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;

  // New
  isGuestMode: boolean;                    // True if user skipped auth
  skipAuthentication: () => Promise<void>; // Enter guest mode
  syncGuestData: () => Promise<void>;      // Sync local data to backend
  hasLocalData: boolean;                   // True if guest has plants/data
}
```

### Service Layer Updates

#### Plant Service
- Add `saveLocalPlant()` - Save plant to AsyncStorage
- Add `getLocalPlants()` - Retrieve plants from AsyncStorage
- Add `syncLocalPlantsToBackend()` - Upload local plants to API
- Update `createPlant()` - Route to local or backend based on auth status
- Update `getPlants()` - Retrieve from local or backend based on auth status

#### Care Log Service
- Add `saveLocalWaterEvent()` - Save water event to AsyncStorage
- Add `getLocalWaterEvents()` - Retrieve events from AsyncStorage
- Add `syncLocalWaterEventsToBackend()` - Upload events to API
- Update water event operations to route based on auth status

#### Photo Service
- Add `saveLocalPhoto()` - Save photo file path to AsyncStorage
- Add `getLocalPhotoPath()` - Retrieve local file path
- Add `uploadLocalPhotosToBackend()` - Upload photos to S3/backend storage
- Update photo operations to route based on auth status

### Species Catalog Bundling

**Bundle Location**: `mobile/assets/data/plant-species-catalog.json`

**Update Strategy**:
1. App ships with complete catalog in assets
2. On app start (with internet): Check backend for catalog version
3. If newer version available: Download and cache in AsyncStorage
4. Species search uses cached version or falls back to bundled version

**Implementation**:
```typescript
// SpeciesService
async loadSpeciesCatalog(): Promise<PlantSpecies[]> {
  try {
    // Try cached version first
    const cached = await AsyncStorage.getItem('@drplantes_species_cache');
    if (cached) {
      const { version, data } = JSON.parse(cached);
      // Check if update available in background
      this.checkForCatalogUpdate(version);
      return data;
    }
  } catch (error) {
    console.warn('Failed to load cached catalog');
  }

  // Fallback to bundled version
  return require('../../assets/data/plant-species-catalog.json');
}
```

### Data Sync Flow

**Trigger Points**:
1. User completes registration from guest mode
2. User logs in with existing account from guest mode (with confirmation)
3. User manually triggers sync from profile (retry failed sync)

**Sync Process**:
```typescript
async syncGuestData(): Promise<void> {
  // 1. Start sync
  setIsSyncing(true);

  try {
    // 2. Sync plants
    const localPlants = await getLocalPlants();
    for (const plant of localPlants) {
      const uploadedPlant = await api.createPlant(plant);
      // Map local ID to backend ID
      idMap.set(plant.id, uploadedPlant.id);
    }

    // 3. Sync photos
    const localPhotos = await getLocalPhotos();
    for (const photo of localPhotos) {
      const backendPlantId = idMap.get(photo.plantId);
      await api.uploadPhoto(backendPlantId, photo.filePath);
    }

    // 4. Sync water events
    const localEvents = await getLocalWaterEvents();
    for (const event of localEvents) {
      const backendPlantId = idMap.get(event.plantId);
      await api.createWaterEvent({ ...event, plantId: backendPlantId });
    }

    // 5. Mark as synced and clear local data
    await AsyncStorage.setItem('@drplantes_guest_data_synced', 'true');
    await clearLocalGuestData();

    setIsSyncing(false);
    setIsGuestMode(false);
  } catch (error) {
    // Keep local data, allow retry
    setIsSyncing(false);
    throw error;
  }
}
```

## UI/UX Requirements

### Authentication Screen Updates

**Current**: Login and Register buttons
**Updated**:
- Login button (primary)
- Register button (secondary)
- "Skip for now" text link (bottom, subtle)

### Profile Screen - Guest Mode

**Guest Mode View**:
```
┌─────────────────────────────────┐
│  Guest Mode                   🚫│
│  Your data is stored locally    │
├─────────────────────────────────┤
│  [Sign Up to Sync Data]    ← Primary button
│                                 │
│  [Already have an account?]     │
│  [Log In]                  ← Secondary link
│                                 │
│  ℹ️ Why sign up?                │
│  • Backup your plant data       │
│  • Access from multiple devices │
│  • Never lose your plants       │
└─────────────────────────────────┘
```

**Authenticated Mode View**:
```
┌─────────────────────────────────┐
│  Account                         │
│  user@example.com               │
├─────────────────────────────────┤
│  Settings                       │
│  About                          │
│  [Log Out]                      │
└─────────────────────────────────┘
```

### Sync Progress UI

**During Sync**:
```
┌─────────────────────────────────┐
│  Syncing Your Data...           │
│                                 │
│  [████████░░░░] 75%            │
│                                 │
│  Uploading plants: 8/10         │
│  Uploading photos: 15/20        │
│  Syncing care logs: 45/50       │
└─────────────────────────────────┘
```

### Data Conflict Resolution (Login from Guest Mode)

**Warning Dialog**:
```
┌─────────────────────────────────┐
│  You have local data            │
│                                 │
│  You have 5 plants and 20 care  │
│  logs stored locally.           │
│                                 │
│  What would you like to do?     │
│                                 │
│  [Sync to My Account] ← Primary │
│  [Discard Local Data]           │
│  [Cancel]                       │
└─────────────────────────────────┘
```

## API Endpoints

No new endpoints required. Existing endpoints will be used:
- `POST /api/v1/plants` - Create plants (batch during sync)
- `POST /api/v1/plants/:id/photo` - Upload photos
- `POST /api/v1/water-events` - Create water events
- `GET /api/v1/plant-species/catalog/version` - Check catalog version
- `GET /api/v1/plant-species/catalog` - Download updated catalog

## Edge Cases

- **What happens if sync fails midway (network error)?**
  - Local data remains intact, user can retry sync from profile
  - Already synced items are tracked to avoid duplicates on retry

- **What happens if a user creates an account with the same email on another device?**
  - Standard login flow, no guest data to sync on that device

- **What happens if photo upload fails during sync?**
  - Plant is created without photo, photo upload is retried separately
  - User sees "Some photos failed to upload" with retry option

- **What happens if user switches to guest mode after logging out?**
  - Any previous authenticated data is not accessible
  - New guest session starts with empty local storage

- **What happens if local storage is full?**
  - User sees error message prompting them to create account to move data to cloud
  - Graceful degradation: older data can be archived

- **What happens if catalog update download fails?**
  - App continues using bundled catalog without disruption
  - Update retry happens on next app start

- **What happens if a user in guest mode tries to use the app on another device?**
  - Other device starts fresh (no data), unless they create account first

## Non-Functional Requirements

- **Performance**:
  - Local data operations should be < 100ms
  - Sync for 50 plants should complete within 30 seconds (good network)

- **Data Integrity**:
  - Local data must never be lost before successful backend sync
  - Sync operation must be atomic (all or nothing, with retry)

- **Storage**:
  - Local storage should handle at least 100 plants with photos
  - Photo storage uses device's photo library capabilities

- **Offline Support**:
  - All features work offline in guest mode
  - Sync queues when offline and triggers when connection restored

## Success Metrics

- 40%+ of new users start in guest mode
- 50%+ of guest users create accounts within 2 weeks
- 90%+ successful sync rate for guest data to backend
- < 5% guest data loss rate due to uninstalls before account creation

## Migration Path (Implementation Order)

1. **Phase 1**: Add guest mode flag and "Skip for now" option
2. **Phase 2**: Implement local storage for plants (read/write)
3. **Phase 3**: Implement local storage for photos and water events
4. **Phase 4**: Update all service calls to route based on auth status
5. **Phase 5**: Bundle species catalog in app assets
6. **Phase 6**: Implement sync functionality
7. **Phase 7**: Update profile screen with guest mode UI
8. **Phase 8**: Add data conflict resolution dialogs
9. **Phase 9**: Testing and edge case handling

## Future Enhancements

- Automatic periodic sync for authenticated users (background)
- Export guest data as JSON file (backup before uninstall)
- Import guest data from JSON file
- Cloud sync status indicators throughout the app
- Conflict resolution for duplicate plants during sync
