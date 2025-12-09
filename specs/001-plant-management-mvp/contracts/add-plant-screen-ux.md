# UX Specification: Add Plant Screen (Enhanced)

**Screen**: Add Plant
**Platform**: Mobile (React Native) & Web
**Purpose**: Allow users to register a new plant in their garden with species selection, photo upload, and calendar date picker

## Screen Layout

### Header
- Title: "Add Plant"
- Left Action: Back button (returns to My Garden)
- Right Action: None (or Save disabled until form valid)

### Form Fields (in order)

1. **Plant Name** (Required)
   - Input: Text field
   - Placeholder: "e.g., My Monstera"
   - Validation: Required, 1-255 characters
   - Helper text: "Give your plant a unique name"

2. **Plant Species** (Optional but recommended)
   - Input: Searchable dropdown/autocomplete
   - Placeholder: "Search by common or scientific name..."
   - Behavior:
     - Shows dropdown when user types (minimum 2 characters)
     - Searches as user types (debounced 300ms)
     - Case-insensitive
     - Searches both common and scientific names
   - Display format in dropdown:
     ```
     Monstera
     Monstera deliciosa
     ---
     Snake Plant
     Sansevieria trifasciata
     ```
   - Selected format: "Monstera (Monstera deliciosa)"
   - Clear button to deselect species
   - Helper text: "Optional - helps track care requirements"

3. **Location** (Optional)
   - Input: Text field
   - Placeholder: "e.g., Living room window"
   - Validation: 0-255 characters
   - Helper text: "Where is this plant in your home?"

4. **Acquisition Date** (Optional)
   - Input: Date picker button
   - Display: "Select date" (when empty) or formatted date (when selected)
   - Behavior:
     - Clicking opens native calendar picker (iOS/Android) or date modal (Web)
     - Maximum date: Today (cannot select future dates)
     - Minimum date: Reasonable past (e.g., 50 years ago)
     - Default: None selected
   - Clear button when date is selected
   - Helper text: "When did you get this plant?"

5. **Photo Upload** (Optional)
   - Input: Image picker button
   - Display:
     - Empty state: Dashed border box with camera icon and "Add Photo" text
     - With photo: Thumbnail preview with remove (X) button overlay
   - Behavior:
     - Click opens system image picker (camera or gallery)
     - Supports: JPEG, PNG
     - Maximum size: 10MB
     - Image automatically resized/compressed for upload
   - Helper text: "Add a photo of your plant"

6. **Notes** (Optional)
   - Input: Multi-line text area
   - Placeholder: "Any notes about this plant..."
   - Validation: 0-1000 characters
   - Helper text: "Care tips, observations, reminders, etc."

### Actions

- **Primary Button**: "Add Plant"
  - Position: Bottom of form (or fixed at bottom on mobile)
  - Enabled: When plant name is filled
  - Disabled: When plant name is empty or uploading photo
  - Loading state: Shows spinner when saving

- **Secondary Button**: "Cancel"
  - Navigates back to My Garden without saving
  - Confirmation: "Discard changes?" if any field has content

## Interactive Behavior

### Species Search Dropdown

**Empty State**:
```
┌─────────────────────────────────┐
│ Search by common or scientific  │
│ name...                          │
│ [cursor blinking]                │
└─────────────────────────────────┘
```

**Loading State** (while searching):
```
┌─────────────────────────────────┐
│ mons                             │
└─────────────────────────────────┘
  ┌───────────────────────────────┐
  │ Searching...                  │
  │ [spinner]                     │
  └───────────────────────────────┘
```

**Results State**:
```
┌─────────────────────────────────┐
│ mons                          [X]│
└─────────────────────────────────┘
  ┌───────────────────────────────┐
  │ Monstera                      │
  │ Monstera deliciosa            │
  ├───────────────────────────────┤
  │ Swiss Cheese Plant            │
  │ Monstera adansonii            │
  └───────────────────────────────┘
```

**No Results State**:
```
┌─────────────────────────────────┐
│ zyxwvu                        [X]│
└─────────────────────────────────┘
  ┌───────────────────────────────┐
  │ No species found              │
  │ Try a different search term   │
  └───────────────────────────────┘
```

**Selected State**:
```
┌─────────────────────────────────┐
│ Monstera                         │
│ Monstera deliciosa            [X]│
└─────────────────────────────────┘
```

### Date Picker

**Mobile (iOS)**:
- Opens native iOS date picker wheel
- Shows month, day, year
- "Cancel" and "Done" buttons

**Mobile (Android)**:
- Opens Material Design calendar picker
- Month/year navigation
- "Cancel" and "OK" buttons

**Web**:
- Opens custom calendar modal overlay
- Month/year dropdowns
- Calendar grid with selectable dates
- "Cancel" and "Select" buttons

**Display Format**:
- US: "MM/DD/YYYY" (e.g., "12/09/2025")
- International: "DD/MM/YYYY" (based on locale)
- Alternative: "Dec 9, 2025" (more readable)

### Photo Upload Flow

1. User clicks "Add Photo" button
2. System shows image source selector:
   - "Take Photo" (camera)
   - "Choose from Library" (gallery)
   - "Cancel"
3. User selects source and picks/takes image
4. Image is validated (size, format)
5. If valid: Shows thumbnail preview
6. If invalid: Shows error message with reason
7. User can remove photo by clicking X on thumbnail

**Upload Indicator**:
```
┌─────────────────────────────────┐
│  [Photo Thumbnail]               │
│  Uploading... 47%                │
│  [Progress bar]                  │
└─────────────────────────────────┘
```

## Validation & Error States

### Field-Level Validation

**Plant Name** (required):
- Error: "Plant name is required"
- Shown: On blur if empty, on submit

**Species Search** (optional):
- Error: "Unable to load species. Try again."
- Shown: If API call fails

**Photo Upload** (optional):
- Error: "File too large. Maximum 10MB."
- Error: "Invalid file type. Use JPEG or PNG."
- Error: "Upload failed. Try again."
- Shown: Immediately after invalid file selected

### Form-Level Validation

On "Add Plant" button click:
1. Check all required fields filled
2. Check no upload in progress
3. If valid: Submit
4. If invalid: Scroll to first error and show message

## Success & Error Handling

### Success Flow

1. User clicks "Add Plant"
2. Button shows loading spinner
3. API request submitted with form data
4. On success:
   - Show success toast: "Plant added successfully!"
   - Navigate back to My Garden
   - New plant appears at top of garden list
   - Garden list refreshes to show new plant

### Error Flow

1. User clicks "Add Plant"
2. Button shows loading spinner
3. API request fails
4. Show error alert/toast:
   - "Unable to add plant. Please try again."
   - Network error: "Connection error. Check your internet."
   - Validation error: Show specific message from API
5. Button returns to normal state
6. User can try again

## Accessibility

- All form fields have accessible labels
- Error messages announced by screen readers
- Touch targets minimum 44x44pt (iOS) / 48x48dp (Android)
- Color contrast meets WCAG AA standards
- Keyboard navigation support (web)
- Focus indicators visible on all interactive elements

## Performance Considerations

- Species search debounced to avoid excessive API calls
- Image compressed before upload to reduce bandwidth
- Form state preserved if app backgrounded
- Optimistic UI updates where possible

## Future Enhancements (Post-MVP)

- Multiple photo upload during creation
- Scan plant QR code to auto-fill species
- Recent/favorite species quick selection
- Copy from existing plant (duplicate)
- Draft autosave
- Voice input for notes
- Suggested species based on location/climate
