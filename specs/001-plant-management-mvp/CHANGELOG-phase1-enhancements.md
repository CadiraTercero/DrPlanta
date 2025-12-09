# Specification Changes: Phase 1 Enhancements

**Date**: 2025-12-09
**Status**: Specification Updated - Ready for Implementation
**Scope**: Enhanced "Add Plant" and "Plant Detail" functionality

## Summary of Changes

This document summarizes the specification changes made to enhance the Phase 1: My Garden - Plant Registry feature with improved species selection, date picking, photo upload, and species information display.

## Modified Documents

### 1. Main Specification
**File**: `spec.md`

**Changes**:
- Updated User Story 1 acceptance scenarios (12 scenarios, previously 8)
- Added new functional requirements FR-009a through FR-009f
- Enhanced FR-016 with sub-requirements FR-016a and FR-016b
- Added 7 new edge cases related to species search, photo upload, and date selection

### 2. New API Contract
**File**: `contracts/plant-species-search-api.md` (NEW)

**Purpose**: Defines the plant species search endpoint specification

**Key Details**:
- Endpoint: `GET /api/v1/plant-species/search?q={searchTerm}`
- Case-insensitive partial matching
- Searches both commonName and latinName fields
- Returns species with full care information
- Includes validation, error handling, and testing scenarios

### 3. New UX Specification - Add Plant Screen
**File**: `contracts/add-plant-screen-ux.md` (NEW)

**Purpose**: Detailed UI/UX specification for enhanced Add Plant screen

**Key Features**:
- Searchable species dropdown with autocomplete
- Native date picker for acquisition date
- Image upload with preview
- Field-by-field validation
- Loading and error states
- Accessibility requirements

### 4. New UX Specification - Plant Detail Screen
**File**: `contracts/plant-detail-screen-ux.md` (NEW)

**Purpose**: Detailed UI/UX specification for enhanced Plant Detail screen

**Key Features**:
- Photo gallery/carousel
- User's custom plant data section
- Plant species information section (conditional)
- Care requirements grid
- Toxicity warnings
- Visual separation between user data and reference data

## Feature Enhancements

### 1. Plant Species Search & Selection

**Previous**: Manual text entry for species (or no species field)

**Enhanced**:
- Searchable dropdown/autocomplete component
- Case-insensitive search
- Partial matching (search for "mons" finds "Monstera")
- Searches both common and scientific names
- Real-time results as user types (debounced)
- Clear button to deselect

**Backend API Required**:
- New endpoint: `GET /api/v1/plant-species/search`
- Query parameter: `q` (search term)
- Minimum 2 characters
- Returns array of matching species

**User Benefits**:
- Easier species selection
- Discover plants by partial name
- Link to expert care information
- Reduces typos and inconsistencies

### 2. Date Picker for Acquisition Date

**Previous**: Manual text entry or no date field

**Enhanced**:
- Native calendar picker UI component
- Visual date selection
- Platform-specific (iOS wheel, Android Material, Web modal)
- Maximum date: Today (prevents future dates)
- Clear button when date selected
- Formatted display (e.g., "Dec 9, 2025")

**User Benefits**:
- Faster date entry
- No formatting errors
- Better mobile experience
- Visual month/year navigation

### 3. Photo Upload During Plant Creation

**Previous**: Photos added later, or not at all

**Enhanced**:
- Photo upload button in Add Plant form
- System image picker (camera or gallery)
- Thumbnail preview
- Validation (size, format)
- Remove/replace capability
- Progress indicator during upload

**Backend Support Required**:
- Image upload endpoint or service
- File validation (JPEG, PNG, max 10MB)
- Image storage (S3, Cloudinary, etc.)
- URL returned in plant record

**User Benefits**:
- Complete plant registration in one flow
- Visual identification in garden
- Document plant state at acquisition

### 4. Plant Species Information Display

**Previous**: No species information shown (or basic link)

**Enhanced**:
Plant Detail screen now displays comprehensive species information when available:

**Care Requirements Grid**:
- Light preference (LOW/MEDIUM/HIGH)
- Water preference (LOW/MEDIUM/HIGH)
- Humidity preference (LOW/MEDIUM/HIGH)
- Difficulty level (EASY/MEDIUM/HARD)

**Safety Information**:
- Toxicity warnings with visual indicators
- Color-coded by severity
- Clear messaging for pet/human safety

**Additional Details**:
- Common and Latin names
- Short description
- Expert care notes
- Recommended indoor/outdoor
- Tags (tropical, climbing, etc.)

**User Benefits**:
- All care info in one place
- Expert-curated guidance
- Safety awareness (toxicity)
- Better plant care outcomes

## Implementation Order

Following spec-driven development, implement in this order:

### 1. Backend - Plant Species Search API
- [ ] Create `GET /api/v1/plant-species/search` endpoint
- [ ] Implement case-insensitive partial matching
- [ ] Add search in both commonName and latinName
- [ ] Add validation (min 2 chars)
- [ ] Add authentication
- [ ] Write unit tests
- [ ] Test with existing plant-species data

### 2. Backend - Image Upload Support
- [ ] Set up image storage service (S3/Cloudinary)
- [ ] Create image upload endpoint
- [ ] Add validation (file type, size)
- [ ] Add image URL field to Plant entity
- [ ] Update Plant DTO to accept image upload
- [ ] Test upload flow

### 3. Mobile - Add Plant Screen Enhancements
- [ ] Add species search autocomplete component
- [ ] Integrate with species search API
- [ ] Add date picker component
- [ ] Add image picker component
- [ ] Update form validation
- [ ] Update Plant service with new fields
- [ ] Test all flows (with/without species, photo, date)

### 4. Mobile - Plant Detail Screen Enhancements
- [ ] Add photo gallery/carousel
- [ ] Separate user data and species data sections
- [ ] Add care requirements grid
- [ ] Add toxicity warnings
- [ ] Fetch and display species information
- [ ] Handle missing species gracefully
- [ ] Test with various plants (with/without species)

## Testing Checklist

### Species Search
- [ ] Search with exact common name returns results
- [ ] Search with exact Latin name returns results
- [ ] Search with partial text returns results
- [ ] Search is case-insensitive (MONS = mons)
- [ ] Search with no results shows empty state
- [ ] Search with < 2 characters shows validation error
- [ ] Search without auth returns 401 error

### Date Picker
- [ ] Date picker opens on tap
- [ ] Today's date is default maximum
- [ ] Selected date displays formatted
- [ ] Clear button removes date
- [ ] Date is optional (can be empty)
- [ ] Future dates are disabled

### Photo Upload
- [ ] Camera option opens camera
- [ ] Gallery option opens photo library
- [ ] Selected image shows thumbnail preview
- [ ] Remove button removes image
- [ ] File too large shows error
- [ ] Invalid format shows error
- [ ] Upload progress indicator appears
- [ ] Failed upload shows retry option

### Plant Detail - Species Info
- [ ] Species info shown when plant has linked species
- [ ] Species info hidden when no species linked
- [ ] Care requirements display correctly
- [ ] Toxicity warnings show with correct styling
- [ ] Description and notes display
- [ ] Tags render as badges
- [ ] Section is visually distinct from user data

## Success Metrics

After implementation, measure:

1. **Species Search Usage**: % of new plants created with species link
   - Target: >70% of plants have linked species

2. **Search Effectiveness**: Average search queries per species selection
   - Target: <3 searches per successful selection

3. **Photo Upload Rate**: % of new plants created with photo
   - Target: >60% of plants have photo

4. **Date Selection**: % of new plants with acquisition date
   - Target: >50% of plants have date

5. **User Engagement**: Time spent on Plant Detail screen
   - Target: >30 seconds average (indicates reading species info)

## Rollback Plan

If issues arise:

1. **Species Search Issues**: Fall back to manual species entry
2. **Photo Upload Issues**: Disable during creation, allow adding later
3. **Date Picker Issues**: Fall back to text input with validation
4. **Species Display Issues**: Hide section until fixed

## Documentation Updates Needed

After implementation:

- [ ] Update API documentation (Swagger/OpenAPI)
- [ ] Update mobile app README with new dependencies
- [ ] Update user guide with new features
- [ ] Create demo video showing new flows
- [ ] Update CLAUDE.md with implementation patterns

## Notes

- All changes maintain backward compatibility
- Existing plants without species continue to work
- Species selection is optional (not required)
- Photo upload is optional
- Date selection is optional
- UI gracefully handles missing data

## Questions to Resolve

None currently - specifications are complete and ready for implementation.

---

**Next Steps**: Begin implementation starting with Backend - Plant Species Search API endpoint.
