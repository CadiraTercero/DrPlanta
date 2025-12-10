# Data Model: Optional Authentication

## Local Storage Schema

### AsyncStorage Keys

```typescript
// Authentication State
'@drplantes_is_guest_mode'        // string: 'true' | 'false'
'@drplantes_guest_data_synced'    // string: 'true' | 'false'
'@drplantes_guest_user_id'        // string: UUID for local guest session

// Plant Data
'@drplantes_guest_plants'         // string: JSON array of LocalPlant[]
'@drplantes_guest_photos'         // string: JSON array of LocalPhoto[]
'@drplantes_guest_water_events'   // string: JSON array of LocalWaterEvent[]

// Species Catalog Cache
'@drplantes_species_cache'        // string: JSON { version: string, data: PlantSpecies[], cachedAt: Date }
'@drplantes_species_version'      // string: Version number of cached catalog

// Sync State Tracking
'@drplantes_sync_progress'        // string: JSON { plants: number, photos: number, events: number }
'@drplantes_last_sync_attempt'    // string: ISO date string
```

### Local Data Types

#### LocalPlant

```typescript
interface LocalPlant {
  // Identity
  id: string;                      // UUID (generated locally)
  localCreatedAt: Date;            // Track when created locally
  syncedToBackend: boolean;        // false until successfully synced
  backendId?: string;              // Populated after sync

  // Plant Data (matches backend Plant entity)
  name: string;
  nickname?: string;
  speciesId?: string;              // References species catalog
  acquisitionDate: Date;
  location?: string;
  photoPath?: string;              // Local file path (file:///...)
  notes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

#### LocalPhoto

```typescript
interface LocalPhoto {
  // Identity
  id: string;                      // UUID (generated locally)
  plantId: string;                 // References LocalPlant.id
  syncedToBackend: boolean;
  backendId?: string;

  // Photo Data
  filePath: string;                // Local file system path
  fileName: string;                // Original file name
  fileSize: number;                // Bytes
  mimeType: string;                // image/jpeg, image/png

  // Timestamps
  createdAt: Date;
}
```

#### LocalWaterEvent

```typescript
interface LocalWaterEvent {
  // Identity
  id: string;                      // UUID (generated locally)
  plantId: string;                 // References LocalPlant.id
  syncedToBackend: boolean;
  backendId?: string;

  // Water Event Data (matches backend WaterEvent entity)
  scheduledDate: Date;
  status: 'PENDING' | 'WATERED' | 'POSTPONED' | 'SKIPPED';
  completedDate?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Species Catalog Cache

```typescript
interface SpeciesCatalogCache {
  version: string;                 // Semantic version (e.g., "1.2.0")
  data: PlantSpecies[];            // Full catalog
  cachedAt: Date;                  // When downloaded
  bundledVersion: string;          // Version bundled with app
}
```

## Sync State Tracking

### ID Mapping

During sync, local UUIDs must be mapped to backend-generated IDs:

```typescript
interface SyncIdMap {
  localId: string;
  backendId: string;
  entityType: 'plant' | 'photo' | 'waterEvent';
  syncedAt: Date;
}

// Stored temporarily in memory during sync
const syncMap = new Map<string, string>();
```

### Sync Progress

```typescript
interface SyncProgress {
  // Totals
  totalPlants: number;
  totalPhotos: number;
  totalWaterEvents: number;

  // Synced counts
  syncedPlants: number;
  syncedPhotos: number;
  syncedWaterEvents: number;

  // Status
  status: 'idle' | 'syncing' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;

  // Failed items (for retry)
  failedPlantIds: string[];
  failedPhotoIds: string[];
  failedEventIds: string[];
}
```

## Backend Data Model (No Changes)

The backend entities remain unchanged. Guest data syncs into existing structures:

### Plant Entity (Existing)
```typescript
@Entity('plants')
export class Plant extends BaseEntity {
  @Column()
  userId: string;                  // User who owns the plant

  @Column()
  name: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ nullable: true })
  speciesId?: string;

  @Column({ type: 'date' })
  acquisitionDate: Date;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  photoUrl?: string;               // S3 URL after upload

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
```

### WaterEvent Entity (Existing)
```typescript
@Entity('water_events')
export class WaterEvent extends BaseEntity {
  @Column()
  plantId: string;

  @Column({ type: 'date' })
  scheduledDate: Date;

  @Column({ type: 'enum', enum: ['PENDING', 'WATERED', 'POSTPONED', 'SKIPPED'] })
  status: string;

  @Column({ type: 'date', nullable: true })
  completedDate?: Date;
}
```

## Data Flow Diagrams

### Guest Mode - Local Storage

```
User Action (Add Plant)
         ↓
  [Mobile App Layer]
         ↓
Check: isGuestMode? → YES
         ↓
  Generate Local UUID
         ↓
Save to AsyncStorage
  (@drplantes_guest_plants)
         ↓
    Return Success
```

### Authenticated Mode - Backend API

```
User Action (Add Plant)
         ↓
  [Mobile App Layer]
         ↓
Check: isGuestMode? → NO
         ↓
   POST /api/v1/plants
         ↓
  Backend generates ID
         ↓
  Return Plant with ID
         ↓
    Cache in State
```

### Guest-to-Authenticated Sync

```
User Registers/Logs In
         ↓
Check: hasLocalData? → YES
         ↓
  Show Sync Confirmation
         ↓
    User Confirms
         ↓
┌─────────────────────┐
│  Sync Process       │
│                     │
│  1. Sync Plants     │──→ POST /api/v1/plants (batch)
│     Map IDs         │    Store: localId → backendId
│                     │
│  2. Sync Photos     │──→ POST /api/v1/plants/:id/photo
│     Use mapped IDs  │    Upload file from device
│                     │
│  3. Sync Events     │──→ POST /api/v1/water-events (batch)
│     Use mapped IDs  │    Create with backend plant IDs
│                     │
│  4. Mark Synced     │──→ Set @drplantes_guest_data_synced = true
│  5. Clear Local     │──→ Remove guest data from AsyncStorage
└─────────────────────┘
         ↓
   Switch to Backend Mode
         ↓
Fetch data from /api/v1/plants
```

## Storage Size Estimates

### Per Plant (Average)
- Plant JSON: ~500 bytes
- Photo (local): 2-5 MB (original quality)
- Water Events (50): ~10 KB

### Capacity Planning
- 100 plants: 50 KB (JSON) + 300 MB (photos)
- 500 plants: 250 KB (JSON) + 1.5 GB (photos)

**Note**: AsyncStorage has no hard limit, but best practice is < 6 MB for JSON data. Photos are stored in device's file system separately.

## Migration Strategy

### Bundled Catalog Structure

```
mobile/
└── assets/
    └── data/
        └── plant-species-catalog.json    ← Copy from specs/data/
```

### Catalog Update Flow

```typescript
async checkForCatalogUpdate() {
  try {
    // Get current version
    const bundledVersion = require('./assets/data/plant-species-catalog.json').version;
    const cachedVersion = await AsyncStorage.getItem('@drplantes_species_version');

    // Check backend for latest version
    const { version: latestVersion } = await api.get('/api/v1/plant-species/catalog/version');

    // Compare versions (semantic versioning)
    if (latestVersion > (cachedVersion || bundledVersion)) {
      // Download updated catalog
      const updatedCatalog = await api.get('/api/v1/plant-species/catalog');

      // Cache it
      await AsyncStorage.setItem('@drplantes_species_cache', JSON.stringify({
        version: latestVersion,
        data: updatedCatalog,
        cachedAt: new Date().toISOString(),
      }));

      await AsyncStorage.setItem('@drplantes_species_version', latestVersion);
    }
  } catch (error) {
    // Fail silently, use bundled/cached version
    console.warn('Failed to check for catalog update:', error);
  }
}
```

## Backup and Recovery

### Pre-Sync Backup

Before attempting sync, create a backup in case of partial failure:

```typescript
interface LocalDataBackup {
  backupId: string;
  timestamp: Date;
  plants: LocalPlant[];
  photos: LocalPhoto[];
  waterEvents: LocalWaterEvent[];
}

// Store at: @drplantes_backup_{timestamp}
```

### Recovery Flow

If sync fails:
1. Keep original local data intact
2. Mark sync as failed in UI
3. User can retry sync (resume from failures)
4. Backup is kept for 7 days then auto-deleted

## Data Validation

### Pre-Sync Validation

Before syncing, validate all local data:

```typescript
interface ValidationResult {
  valid: boolean;
  errors: {
    plants: string[];      // "Plant 'abc' missing required field 'name'"
    photos: string[];      // "Photo 'xyz' file not found"
    events: string[];      // "Event 'def' references missing plant"
  };
}
```

### Validation Rules
- All plants must have required fields (name, acquisitionDate)
- All photos must have valid file paths that exist
- All water events must reference existing local plant IDs
- Dates must be valid and not in distant future (> 1 year)

## Conflict Resolution

### Duplicate Detection

When syncing to existing account:

```typescript
interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchScore: number;        // 0-100
  existingPlant: Plant;
  strategy: 'merge' | 'skip' | 'create_new';
}

// Match criteria:
// - Same species + same acquisition date (within 7 days) = 90%
// - Same name + same location = 70%
// - Same nickname = 60%
```

### Merge Strategy

If duplicates detected:
1. Show user list of potential duplicates
2. User chooses: Keep both | Merge | Skip local
3. If merge: Use most recent data for each field
