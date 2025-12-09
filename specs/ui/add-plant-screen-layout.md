# Add Plant Screen - UI Layout Specification

## Overview
The Add Plant screen should have all interactive elements (Back button, Save button) within the scrollable content area, not in a fixed header.

## Layout Structure

```
┌─────────────────────────────────────┐
│  ScrollView (entire screen)         │
│  ┌───────────────────────────────┐  │
│  │ ← Back    Add Plant           │  │ ← Scrollable header
│  └───────────────────────────────┘  │
│                                      │
│  Photos Section                      │
│  [Photo thumbnails + Add button]     │
│                                      │
│  Plant Name *                        │
│  [Input field]                       │
│                                      │
│  Species                             │
│  [Search input with dropdown]        │
│                                      │
│  Location                            │
│  [Input field]                       │
│                                      │
│  Acquisition Date                    │
│  [Date picker button]                │
│                                      │
│  Notes                               │
│  [Multiline text input]              │
│                                      │
│  ┌───────────────────────────────┐  │
│  │      Save Plant               │  │ ← Scrollable save button
│  └───────────────────────────────┘  │
│                                      │
└─────────────────────────────────────┘
```

## Component Hierarchy

```jsx
<View style={styles.container}>
  <ScrollView style={styles.form}>
    {/* Header Buttons - INSIDE ScrollView */}
    <View style={styles.headerButtons}>
      <TouchableOpacity style={styles.backButton}>
        <Text>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Add Plant</Text>
    </View>

    {/* Form content... */}

    {/* Save Button - INSIDE ScrollView */}
    <TouchableOpacity style={styles.saveButtonContainer}>
      <Text>Save Plant</Text>
    </TouchableOpacity>
  </ScrollView>
</View>
```

## Key Requirements

1. **No Fixed Header**: There should be NO View with `styles.header` positioned outside the ScrollView
2. **Scrollable Back Button**: The back button must be the first element INSIDE the ScrollView
3. **Scrollable Save Button**: The save button must be the last element INSIDE the ScrollView
4. **All Content Moves**: When user scrolls, the back button should scroll UP off screen, and the save button should scroll INTO view

## Visual Behavior

- **On Page Load**: User sees the back button and "Add Plant" title at the top
- **While Scrolling Down**: The back button and title scroll up and off the screen
- **At Bottom**: The save button is visible after the Notes field
- **While Scrolling Up**: Everything scrolls back into view including the header

## Styling Requirements

### Header Buttons (inside ScrollView)
```typescript
headerButtons: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  paddingTop: 8,
}

backButton: {
  padding: 8,
}

backButtonText: {
  fontSize: 16,
  color: '#666',
  fontWeight: '500',
}

screenTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  marginLeft: 16,
}
```

### Save Button (inside ScrollView)
```typescript
saveButtonContainer: {
  backgroundColor: '#4CAF50',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 24,
  marginBottom: 32,
}

saveButtonText: {
  fontSize: 18,
  color: '#fff',
  fontWeight: 'bold',
}
```

## Anti-Patterns (What NOT to do)

❌ **WRONG**: Fixed header outside ScrollView
```jsx
<View style={styles.container}>
  <View style={styles.header}>  {/* BAD: Fixed header */}
    <TouchableOpacity onPress={goBack}>
      <Text>Cancel</Text>
    </TouchableOpacity>
    <Text>Add Plant</Text>
    <TouchableOpacity onPress={handleSubmit}>
      <Text>Save</Text>
    </TouchableOpacity>
  </View>
  <ScrollView>
    {/* Form content */}
  </ScrollView>
</View>
```

✅ **CORRECT**: All buttons inside ScrollView
```jsx
<View style={styles.container}>
  <ScrollView>
    <View style={styles.headerButtons}>  {/* GOOD: Inside ScrollView */}
      <TouchableOpacity onPress={goBack}>
        <Text>← Back</Text>
      </TouchableOpacity>
      <Text>Add Plant</Text>
    </View>

    {/* Form content */}

    <TouchableOpacity onPress={handleSubmit}>  {/* GOOD: Inside ScrollView */}
      <Text>Save Plant</Text>
    </TouchableOpacity>
  </ScrollView>
</View>
```

## Implementation File

`/Users/xavi.zanatta/Documents/DrPlantes/mobile/src/screens/AddPlantScreen.tsx`

## Verification Checklist

- [ ] No View with `styles.header` exists outside ScrollView
- [ ] Back button is first element inside ScrollView
- [ ] Save button is last element inside ScrollView
- [ ] When scrolling down, back button disappears off top of screen
- [ ] When scrolling up from bottom, save button disappears off bottom of screen
- [ ] All interactive elements (Back, Save) are touchable and functional
