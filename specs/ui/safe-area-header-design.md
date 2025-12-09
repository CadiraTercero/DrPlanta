# Safe Area Header Design Pattern

## Overview
All screens should have a fixed header area that respects system UI elements (status bar, notch, etc.) and contains navigation controls. The content below scrolls independently.

## Design Principle

### Fixed Header with Safe Area
- Header is **fixed at the top** (not scrollable)
- Header respects **safe area insets** (status bar, notch, Dynamic Island)
- Header contains navigation controls (Back button, title, action buttons)
- Content below header is **scrollable**

### Visual Layout

```
┌─────────────────────────────────────┐
│  [Status Bar / Notch Safe Area]     │ ← System UI
├─────────────────────────────────────┤
│  ← Back          Title               │ ← Fixed Header
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ Scrollable Content            │  │
│  │                               │  │
│  │ [Form fields, data, etc.]    │  │
│  │                               │  │
│  │                               │  │
│  │ [Save/Delete buttons]         │  │
│  │                               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Implementation

### Component Structure

```jsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container} edges={['top']}>
  {/* Fixed Header */}
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text style={styles.backButton}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Screen Title</Text>
    {/* Optional: Right action button */}
  </View>

  {/* Scrollable Content */}
  <ScrollView style={styles.content}>
    {/* All page content */}
  </ScrollView>
</SafeAreaView>
```

### Required Package

This design requires `react-native-safe-area-context`:
```json
"react-native-safe-area-context": "~5.6.0"
```
(Already installed in the project)

## Styling Guidelines

### Container
```typescript
container: {
  flex: 1,
  backgroundColor: '#fff',
}
```

### Fixed Header
```typescript
header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
  // No need for paddingTop - SafeAreaView handles it
}

backButton: {
  fontSize: 16,
  color: '#666',
  fontWeight: '500',
  padding: 8,
}

headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginLeft: 16,
  flex: 1,
}
```

### Scrollable Content
```typescript
content: {
  flex: 1,
  padding: 16,
}
```

## Screens to Apply This Pattern

### ✅ Applies to:
1. **AddPlantScreen** - Form with back button and save action ✓ Applied
2. **PlantDetailScreen** - Detail view with back and delete buttons ✓ Applied
3. **MyGardenScreen** - List view with header and add button ✓ Applied
4. **EditPlantScreen** (if created) - Form with back and save actions
5. **Any screen with navigation controls**

### ❌ Does NOT apply to:
1. **HomeScreen/TabNavigator** - Uses tab navigation
2. **Modal screens** - Different pattern
3. **Full-screen overlays**

## Button Placement

### Primary Actions (Save, Submit, etc.)
- **Location**: At the **bottom** of scrollable content
- **Style**: Full-width prominent button
- **Behavior**: Scrolls into view when user scrolls down

### Destructive Actions (Delete, Remove, etc.)
- **Location**: At the **bottom** of scrollable content (after primary content)
- **Style**: Full-width destructive button (red)
- **Behavior**: Requires confirmation dialog

### Example:
```jsx
<ScrollView style={styles.content}>
  {/* All form fields and content */}

  {/* Primary Action */}
  <TouchableOpacity style={styles.primaryButton}>
    <Text style={styles.primaryButtonText}>Save Plant</Text>
  </TouchableOpacity>

  {/* Destructive Action (if applicable) */}
  <TouchableOpacity style={styles.destructiveButton}>
    <Text style={styles.destructiveButtonText}>Delete Plant</Text>
  </TouchableOpacity>
</ScrollView>
```

## Edge Cases

### iOS Notch/Dynamic Island
- SafeAreaView automatically adds padding for notch/Dynamic Island
- No manual calculation needed

### Android Status Bar
- SafeAreaView respects Android status bar height
- Consistent behavior across devices

### Landscape Mode
- Header remains fixed at top
- Safe areas adjust automatically

### Keyboard
- Use `KeyboardAvoidingView` if needed for forms
- ScrollView handles keyboard scroll automatically with `keyboardShouldPersistTaps="handled"`

## Benefits

1. **Consistency**: All screens follow same pattern
2. **Safety**: Never overlaps with system UI
3. **Accessibility**: Back button always reachable
4. **Native Feel**: Matches iOS/Android conventions
5. **Maintainability**: Single pattern to maintain

## Migration Notes

When updating existing screens:
1. Wrap root View with `SafeAreaView` from `react-native-safe-area-context`
2. Add `edges={['top']}` to only apply safe area to top
3. Move navigation controls to fixed header
4. Move content to ScrollView
5. Move action buttons (Save/Delete) to bottom of ScrollView
6. Remove any manual padding calculations for status bar

## Example: Before vs After

### Before (Scrollable Header)
```jsx
<View style={styles.container}>
  <ScrollView>
    <View style={styles.headerButtons}>
      <TouchableOpacity><Text>← Back</Text></TouchableOpacity>
      <Text>Title</Text>
    </View>
    {/* Content */}
  </ScrollView>
</View>
```

### After (Fixed Header with Safe Area)
```jsx
<SafeAreaView style={styles.container} edges={['top']}>
  <View style={styles.header}>
    <TouchableOpacity><Text>← Back</Text></TouchableOpacity>
    <Text>Title</Text>
  </View>
  <ScrollView style={styles.content}>
    {/* Content */}
  </ScrollView>
</SafeAreaView>
```

## Testing Checklist

When implementing this pattern, verify:
- [ ] Back button visible and not overlapped by status bar
- [ ] Header stays fixed when scrolling content
- [ ] Content scrolls smoothly under header
- [ ] Works on iPhone with notch/Dynamic Island
- [ ] Works on Android with various status bar heights
- [ ] Landscape mode works correctly
- [ ] Keyboard doesn't hide important content
