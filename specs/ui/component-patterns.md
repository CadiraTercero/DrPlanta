# UI Component Patterns

This document describes reusable UI patterns and components used throughout the DrPlantes mobile application.

## Table of Contents
1. [Themed Text Input](#themed-text-input)
2. [Dropdown/Autocomplete Pattern](#dropdownautocomplete-pattern)

---

## Themed Text Input

### Overview
The `ThemedTextInput` component is a wrapper around React Native's `TextInput` that automatically applies theme-aware placeholder colors.

### Location
`mobile/src/components/ThemedTextInput.tsx`

### Purpose
- Ensures consistent placeholder text color across the app
- Prevents placeholder color differences between development and production builds
- Provides a single source of truth for text input theming

### Usage

```typescript
import { ThemedTextInput } from '../components/ThemedTextInput';

<ThemedTextInput
  style={styles.input}
  placeholder="Enter plant name..."
  value={value}
  onChangeText={setValue}
/>
```

### Implementation Details

```typescript
export const ThemedTextInput: React.FC<ThemedTextInputProps> = (props) => {
  const theme = useTheme();

  return (
    <TextInput
      {...props}
      placeholderTextColor={props.placeholderTextColor || theme.colors.placeholder}
      style={[styles.input, props.style]}
    />
  );
};
```

### Theme Configuration
The placeholder color is defined in the theme:

```typescript
// mobile/src/theme/theme.ts
export const lightTheme = {
  colors: {
    placeholder: '#999999',
    // ... other colors
  },
};
```

---

## Dropdown/Autocomplete Pattern

### Overview
A reusable pattern for creating dropdown/autocomplete components with proper layering, scrolling, and keyboard interaction.

### Use Cases
- Species search in Add Plant and Edit Plant screens
- Any autocomplete or search-with-suggestions functionality

### Implementation Pattern

#### 1. Structure
```typescript
{/* Wrapper with relative positioning */}
<View style={styles.wrapperContainer}>
  {/* Input field */}
  <ThemedTextInput
    style={styles.input}
    placeholder="Search..."
    value={query}
    onChangeText={handleSearch}
  />

  {/* Loading spinner */}
  {isSearching && (
    <ActivityIndicator style={styles.searchSpinner} />
  )}

  {/* Dropdown results */}
  {showResults && results.length > 0 && (
    <View style={styles.resultsContainer}>
      <ScrollView
        style={styles.scrollView}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {results.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.resultItem}
            onPress={() => handleSelect(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}
</View>
```

#### 2. Required Styles

```typescript
const styles = StyleSheet.create({
  // Wrapper with relative positioning to contain the dropdown
  wrapperContainer: {
    position: 'relative',
  },

  // Absolutely positioned dropdown container
  resultsContainer: {
    position: 'absolute',
    top: 60,           // Adjust based on input height
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 200,
    zIndex: 1000,      // High z-index to float above other elements
    elevation: 5,      // Android shadow
    shadowColor: '#000',      // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // ScrollView for scrollable results
  scrollView: {
    maxHeight: 200,    // Match container maxHeight
  },

  // Individual result item
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  // Loading spinner positioning
  searchSpinner: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});
```

#### 3. Key Properties Explained

##### Container Positioning
- **Parent wrapper**: `position: 'relative'` - Creates positioning context for absolute children
- **Dropdown container**: `position: 'absolute'` - Removes from flow, floats above other content
- **`top` value**: Distance from input (adjust based on input height + desired gap)
- **`left: 0, right: 0`**: Spans full width of parent wrapper

##### Layering (Z-Index/Elevation)
- **`zIndex: 1000`**: High value ensures dropdown floats above other elements (iOS/web)
- **`elevation: 5`**: Android's shadow/layering system
- Both are required for cross-platform compatibility

##### Shadow Effects
- **Android**: `elevation` property automatically adds shadow
- **iOS**: Requires explicit `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`

##### ScrollView Configuration
- **`nestedScrollEnabled={true}`**: Required when ScrollView is inside another ScrollView (e.g., form)
- **`keyboardShouldPersistTaps="handled"`**: Allows tapping results while keyboard is visible
- **`style={styles.scrollView}`**: Container styling for the scrollable area

#### 4. Best Practices

##### Do's
- ✅ Use `position: 'relative'` on parent wrapper
- ✅ Use `position: 'absolute'` on dropdown container
- ✅ Include both `zIndex` and `elevation` for cross-platform support
- ✅ Use `nestedScrollEnabled` when inside parent ScrollView
- ✅ Add `keyboardShouldPersistTaps="handled"` for keyboard interaction
- ✅ Include shadow styling for both platforms
- ✅ Set `maxHeight` to prevent dropdown from being too tall
- ✅ Use `borderRadius` and `borderWidth` for visual definition

##### Don'ts
- ❌ Don't rely on z-index alone (won't work on Android)
- ❌ Don't rely on elevation alone (won't work on iOS)
- ❌ Don't forget `nestedScrollEnabled` when nested in ScrollView
- ❌ Don't use very high `maxHeight` (limits usability)
- ❌ Don't forget to hide dropdown when item is selected

#### 5. Example: Species Search

See implementation in:
- `mobile/src/screens/AddPlantScreen.tsx` (lines 264-315)
- `mobile/src/screens/EditPlantScreen.tsx` (lines 311-362)

Key features:
- Real-time search with debouncing
- Loading spinner during search
- Selected state display
- Clear selection functionality
- Proper keyboard interaction

---

## Future Patterns

As new reusable UI patterns are developed, they should be documented here with:
- Overview and purpose
- Implementation example
- Style requirements
- Best practices
- Cross-platform considerations
