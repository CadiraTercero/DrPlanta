# UX Specification: Plant Detail Screen (Enhanced)

**Screen**: Plant Detail
**Platform**: Mobile (React Native) & Web
**Purpose**: Display comprehensive plant information including user's custom data and linked plant species care information

## Screen Layout

### Header
- Title: Plant name (user's custom name)
- Left Action: Back button (returns to My Garden)
- Right Action: Edit button / More menu (•••)
  - Edit Plant
  - Delete Plant

### Content Sections (scrollable)

---

#### Section 1: Plant Photo Gallery
- Display: Carousel/slider of plant photos
- First photo: Primary/featured image
- Indicators: Dots showing current photo (1 of 3)
- Behavior: Swipeable, tap to view fullscreen
- Empty state: Placeholder image with plant icon

---

#### Section 2: Your Plant Details
**Visual Style**: Card with light background to distinguish from species info

**Fields Displayed**:

- **Name**: Large, bold text
  - User's custom plant name (e.g., "My Monstera")

- **Location**:
  - Icon: 📍 Pin
  - Text: User's specified location (e.g., "Living room window")
  - Empty state: "No location specified"

- **Acquisition Date**:
  - Icon: 📅 Calendar
  - Text: Formatted date (e.g., "Added on Dec 9, 2025")
  - Relative: "3 months ago" if recent
  - Empty state: "Date not specified"

- **Notes** (if provided):
  - Icon: 📝 Note
  - Text: User's custom notes
  - Display: Collapsible if very long (>200 chars)
  - Empty state: Hidden if no notes

---

#### Section 3: Plant Species Information
**Conditional**: Only shown if plant has linked species
**Visual Style**: Card with distinct color/border to show it's reference data

**Header**:
- Title: "Species Information"
- Subtitle: Species common name and scientific name
  - Example: "Monstera"
  - Example: "*Monstera deliciosa*" (italics for Latin name)

**Care Requirements Grid**:

```
┌─────────────────┬─────────────────┐
│ ☀️ Light        │ 💧 Water        │
│ Medium          │ Medium          │
├─────────────────┼─────────────────┤
│ 💦 Humidity     │ 📊 Difficulty   │
│ High            │ Easy            │
└─────────────────┴─────────────────┘
```

**Additional Information**:

- **Toxicity Warning** (if applicable):
  - Visual: ⚠️ Warning icon with colored background
  - Text: "Toxic to pets and humans"
  - Styles:
    - NON_TOXIC: Green, "Safe for pets and humans"
    - TOXIC_PETS: Orange, "Toxic to pets"
    - TOXIC_HUMANS: Orange, "Toxic to humans"
    - TOXIC_PETS_AND_HUMANS: Red, "Toxic to pets and humans"

- **Recommended Indoor**:
  - Visual: 🏠 House icon
  - Text: "Recommended for indoor growing" or "Best suited for outdoor"

- **Description**:
  - Heading: "About this plant"
  - Text: Species short description (1-3 sentences)
  - Style: Readable body text

- **Care Notes** (if provided):
  - Heading: "Care Tips"
  - Text: Expert-provided care notes
  - Style: Collapsible section
  - Empty state: Hidden if no notes

- **Tags** (if provided):
  - Visual: Pill-shaped badges
  - Examples: "tropical" "climbing" "large-leaves"
  - Style: Inline, wrap if multiple

**Empty State** (no species linked):
```
┌─────────────────────────────────┐
│   No species information        │
│   available for this plant.     │
│                                 │
│   [Link Species]                │
└─────────────────────────────────┘
```

---

#### Section 4: Care History (Future)
*Placeholder for watering history, fertilizing, etc.*

---

### Action Buttons (Fixed at bottom or floating)

- **Primary**: Context-specific action
  - "Water Now" (when watering feature implemented)
  - "Add Photo" (if no photos)

- **Secondary**: "Edit Plant"

## Visual Design Principles

### Hierarchy
1. **Most Important**: User's custom data (their plant name, photo, location)
2. **Supporting**: Species reference information (care requirements)
3. **Tertiary**: Actions and metadata

### Information Scent
- **User Data**: Personal, specific to this plant instance
  - Warmer colors, prominent placement
  - Editable fields indicated

- **Species Data**: Reference, applies to all plants of this species
  - Cooler colors, clearly labeled
  - Not editable (managed by experts)
  - Linked to authoritative source

### Visual Separation
```
┌──────────────────────────────────┐
│  [Photo Gallery]                  │
│                                   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Your Plant Details               │  ← Light background
│  📍 Living room window            │
│  📅 Added 3 months ago            │
│  📝 Loves bright indirect light   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  🌿 Species Information           │  ← Distinct border/bg
│  Monstera                         │
│  Monstera deliciosa               │
│                                   │
│  Care Requirements:               │
│  [Grid of care info]              │
│                                   │
│  ⚠️ Toxic to pets and humans      │
└──────────────────────────────────┘
```

## Interactive Behavior

### Photo Gallery
- Tap photo: Opens fullscreen lightbox view
- Swipe: Navigate between photos
- Long press: Show options (Set as primary, Delete)
- Fullscreen: Pinch to zoom, swipe to dismiss

### Edit Flow
1. User taps "Edit" in header
2. Navigation to Edit Plant screen (pre-filled form)
3. User makes changes
4. User saves or cancels
5. Returns to detail screen with updated info

### Delete Flow
1. User taps "Delete" in menu
2. Confirmation dialog appears:
   ```
   Delete "My Monstera"?

   This will permanently delete this plant
   and all its photos and history.

   [Cancel]  [Delete]
   ```
3. If confirmed: Plant deleted, navigate to My Garden
4. Show success toast: "Plant deleted"

### Species Link Flow (if not linked)
1. User taps "Link Species" button
2. Opens species search modal/screen
3. User searches and selects species
4. Plant updated with species link
5. Screen refreshes to show species info

## Responsive Behavior

### Mobile (Portrait)
- Single column layout
- Full-width sections
- Stacked care requirement cards

### Tablet/Desktop
- Two-column layout possible
- Photos on left, info on right
- Wider care requirements grid (2x3 or 3x2)

## Loading States

**Initial Load**:
```
┌──────────────────────────────────┐
│  [Skeleton/shimmer for photo]     │
│  [Skeleton for text lines]        │
│  [Skeleton for cards]             │
└──────────────────────────────────┘
```

**Species Info Loading** (if loaded separately):
```
┌──────────────────────────────────┐
│  🌿 Species Information           │
│  Loading care information...      │
│  [Spinner]                        │
└──────────────────────────────────┘
```

## Error States

**Failed to Load Plant**:
```
┌──────────────────────────────────┐
│        ❌                         │
│  Unable to load plant details     │
│  Please try again                 │
│                                   │
│  [Retry]  [Go Back]               │
└──────────────────────────────────┘
```

**Failed to Load Species Info**:
```
┌──────────────────────────────────┐
│  🌿 Species Information           │
│  ⚠️ Unable to load species info   │
│  [Retry]                          │
└──────────────────────────────────┘
```

## Accessibility

- Screen reader announces: "Plant details for [plant name]"
- All icons have text labels
- Care requirement values have semantic meaning (not just colors)
- Toxicity warnings have sufficient color contrast
- Touch targets minimum 44x44pt
- Content respects user's font size preferences

## Performance

- Plant data prefetched when list item tapped
- Species info can load asynchronously (if not cached)
- Images lazy loaded and cached
- Smooth transitions between screens

## Future Enhancements

- Share plant card (social media, export)
- Compare with other plants
- Plant timeline/growth tracking
- AI-powered health assessment from photos
- Care reminder integration
- Plant journal entries
