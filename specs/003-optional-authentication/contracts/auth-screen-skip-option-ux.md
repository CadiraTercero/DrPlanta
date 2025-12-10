# Contract: Authentication Screen - Skip Option UX

**Feature**: Optional Authentication (Guest Mode)
**Component**: Authentication/Login Screen
**Last Updated**: 2025-12-10

## Overview

The Authentication Screen is the entry point for new users. It must present login and registration options while offering a clear path to skip authentication and use the app immediately in guest mode.

## Screen Layout

### Initial Authentication Screen

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│        🌱                           │ ← App logo (large, 120x120pt)
│     DrPlantes                       │ ← App name (32pt, bold)
│                                     │
│  Your personal plant care          │ ← Tagline (16pt, gray)
│  companion                          │
│                                     │
│                                     │
│                                     │
│  [Log In]                           │ ← Primary button (full-width)
│                                     │
│  [Sign Up]                          │ ← Secondary button (full-width)
│                                     │
│                                     │
│  Skip for now                       │ ← Text link (centered, subtle)
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## Elements Specification

### 1. App Logo
- **Size**: 120x120pt
- **Position**: Centered horizontally, top third of screen
- **Style**: Green plant icon (brand color)
- **Behavior**: Static (no animation on first load)

### 2. App Name
- **Text**: "DrPlantes"
- **Font**: 32pt, bold
- **Color**: Dark gray (#212121)
- **Position**: Below logo, centered

### 3. Tagline
- **Text**: "Your personal plant care companion"
- **Font**: 16pt, regular
- **Color**: Light gray (#757575)
- **Position**: Below app name, centered
- **Line Height**: 1.5

### 4. Log In Button
- **Label**: "Log In"
- **Style**: Primary button
  - Background: Green (#4CAF50)
  - Text: White, 16pt, bold
  - Height: 48pt
  - Width: Full width minus 32pt margins (16pt each side)
  - Border Radius: 8pt
- **Position**: Center-bottom area, above Sign Up button
- **Spacing**: 16pt margin above Sign Up button

### 5. Sign Up Button
- **Label**: "Sign Up"
- **Style**: Secondary button
  - Background: White
  - Border: 2pt solid green (#4CAF50)
  - Text: Green (#4CAF50), 16pt, bold
  - Height: 48pt
  - Width: Full width minus 32pt margins
  - Border Radius: 8pt
- **Position**: Below Log In button
- **Spacing**: 16pt margin below

### 6. Skip for Now Link
- **Text**: "Skip for now"
- **Style**: Text link
  - Color: Medium gray (#9E9E9E)
  - Font: 14pt, regular
  - Underline: None (no underline by default)
  - Underline on press: Yes (shows when tapped)
- **Position**: Centered, 32pt below Sign Up button
- **Behavior**: Tappable area extends 44pt vertical (accessibility)

## Interactions

### Log In Button

**Action**: Tap
**Behavior**: Navigate to Login Form Screen

**Login Form Screen**:
```
┌─────────────────────────────────────┐
│  ← Back      Log In                 │ ← Header with back button
├─────────────────────────────────────┤
│                                     │
│  Email                              │
│  [________________]                 │ ← Email input
│                                     │
│  Password                           │
│  [________________] 👁              │ ← Password input with show/hide
│                                     │
│  [Forgot password?]                 │ ← Link (right-aligned)
│                                     │
│  [Log In]                           │ ← Submit button
│                                     │
│  Don't have an account?             │
│  [Sign Up]                          │ ← Link to registration
│                                     │
└─────────────────────────────────────┘
```

### Sign Up Button

**Action**: Tap
**Behavior**: Navigate to Registration Form Screen

**Registration Form Screen**:
```
┌─────────────────────────────────────┐
│  ← Back      Sign Up                │ ← Header with back button
├─────────────────────────────────────┤
│                                     │
│  Name                               │
│  [________________]                 │ ← Name input
│                                     │
│  Email                              │
│  [________________]                 │ ← Email input
│                                     │
│  Password                           │
│  [________________] 👁              │ ← Password input
│                                     │
│  Password must be at least 8        │ ← Helper text
│  characters                         │
│                                     │
│  [Sign Up]                          │ ← Submit button
│                                     │
│  Already have an account?           │
│  [Log In]                           │ ← Link to login
│                                     │
└─────────────────────────────────────┘
```

### Skip for Now Link

**Action**: Tap
**Behavior**:
1. Show subtle loading indicator (200ms)
2. Initialize guest mode (set `isGuestMode = true` in AsyncStorage)
3. Navigate to Home Screen (main app)

**No confirmation dialog** - immediate transition to app

**Visual Feedback**:
- Text briefly changes to darker gray on press
- Optional: Brief fade animation (200ms) before navigation

## User Flows

### Flow 1: New User Skips Authentication

```
[Launch App]
         ↓
[Authentication Screen]
         ↓ (Tap "Skip for now")
[Home Screen - Guest Mode]
         ↓
User can immediately:
- Add plants
- Upload photos
- View water calendar
- All features available
```

### Flow 2: New User Signs Up

```
[Launch App]
         ↓
[Authentication Screen]
         ↓ (Tap "Sign Up")
[Registration Form]
         ↓ (Complete form)
[Home Screen - Authenticated]
```

### Flow 3: Returning User Logs In

```
[Launch App]
         ↓
[Authentication Screen]
         ↓ (Tap "Log In")
[Login Form]
         ↓ (Enter credentials)
[Home Screen - Authenticated]
         ↓
Data synced from backend
```

### Flow 4: User Skips, Later Creates Account

```
[Already in App - Guest Mode]
         ↓
[Navigate to Profile]
         ↓
[See "Sign Up to Sync Data"]
         ↓ (Tap button)
[Registration Form]
         ↓ (Complete)
[Syncing Screen]
         ↓
[Home Screen - Authenticated]
All guest data now synced
```

## Edge Cases

### App Already Used in Guest Mode

**Scenario**: User opens app, already in guest mode from previous session

**Behavior**:
- Skip authentication screen entirely
- Go directly to Home Screen
- User remains in guest mode
- Profile shows "Sign Up to Sync Data"

**Implementation Note**: Check AsyncStorage on app launch for `@drplantes_is_guest_mode` flag

### App Previously Logged In

**Scenario**: User opens app, was previously authenticated

**Behavior**:
- Skip authentication screen entirely
- Attempt to refresh auth token
- If token valid: Go to Home Screen (authenticated)
- If token expired: Show Authentication Screen

### Network Error on Skip

**Scenario**: User taps "Skip for now" but device has no connectivity

**Behavior**:
- Guest mode still works (no network required)
- Navigate to Home Screen normally
- Species catalog loads from bundled version
- All features work offline

## Accessibility

### VoiceOver Labels

| Element | Accessibility Label |
|---------|---------------------|
| Logo | "DrPlantes logo" |
| Log In button | "Log In. Double tap to sign in to your account." |
| Sign Up button | "Sign Up. Double tap to create a new account." |
| Skip link | "Skip for now. Double tap to use the app without an account. Your data will be stored on this device only." |

### Touch Targets

All interactive elements meet minimum 44x44pt touch target:
- Log In button: 48pt height ✓
- Sign Up button: 48pt height ✓
- Skip link: Extends to 44pt height even though text is 14pt ✓

### Dynamic Type

- All text scales with system font size
- Button heights increase with larger text
- Layout remains usable at 200% text size

### VoiceOver Navigation Order

1. App logo ("DrPlantes logo")
2. App name ("DrPlantes")
3. Tagline ("Your personal plant care companion")
4. Log In button
5. Sign Up button
6. Skip for now link

## Visual Design

### Colors

```typescript
const colors = {
  primary: '#4CAF50',        // Green (buttons, brand)
  background: '#FFFFFF',     // White
  text: {
    primary: '#212121',      // Dark gray (titles)
    secondary: '#757575',    // Light gray (subtitles)
    tertiary: '#9E9E9E',     // Medium gray (skip link)
  },
  border: '#E0E0E0',         // Light gray (input borders)
};
```

### Typography Scale

```typescript
const typography = {
  appName: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
  tagline: { fontSize: 16, fontWeight: 'regular', lineHeight: 24 },
  button: { fontSize: 16, fontWeight: 'bold' },
  link: { fontSize: 14, fontWeight: 'regular' },
};
```

### Spacing

```typescript
const spacing = {
  logoToName: 16,          // Space between logo and app name
  nameToTagline: 8,        // Space between name and tagline
  contentToButtons: 64,    // Space from tagline to first button
  buttonToButton: 16,      // Space between buttons
  buttonToSkip: 32,        // Space from last button to skip link
  screenMargin: 16,        // Left/right margins
};
```

### Layout Calculations

**Vertical Distribution**:
```
Top Margin: 20% of screen height
Logo Section: ~200pt
Spacer: Flexible (remaining space ÷ 2)
Buttons Section: ~150pt
Bottom Margin: 40pt
```

## Animation

### On Initial Load
- **Logo**: Fade in + scale (0.8 → 1.0), 400ms, ease-out
- **App Name**: Fade in, 400ms, delay 100ms
- **Tagline**: Fade in, 400ms, delay 200ms
- **Buttons**: Slide up + fade in, 400ms, delay 300ms
- **Skip Link**: Fade in, 400ms, delay 400ms

### Button Press
- **Scale**: 1.0 → 0.95, 100ms duration
- **Color**: Darken 10%, 100ms duration
- Release: Return to original, 100ms duration

### Skip Link Press
- **Color**: Change to darker gray (#757575), instant
- **Underline**: Show, instant
- Release: Return to original

### Navigation Transition
- **Fade Out**: Current screen, 200ms
- **Fade In**: Next screen, 300ms

## Form Validation (Login/Sign Up Screens)

### Email Validation
- **Format**: Standard email regex
- **Error Message**: "Please enter a valid email address"
- **Display**: Below input field, red text

### Password Validation
- **Minimum Length**: 8 characters
- **Error Message**: "Password must be at least 8 characters"
- **Display**: Below input field, red text
- **Show Requirement**: Helper text always visible

### Real-Time Validation
- Validate on blur (when user leaves input field)
- Don't show errors until user has interacted with field
- Clear errors when user starts typing again

## Testing Checklist

### Visual Tests
- [ ] Screen renders correctly on iPhone SE (small screen)
- [ ] Screen renders correctly on iPhone 15 Pro Max (large screen)
- [ ] Screen renders correctly on iPad (tablet)
- [ ] Logo and text are centered horizontally
- [ ] All margins and spacing match specifications
- [ ] Colors match design system

### Interaction Tests
- [ ] Log In button navigates to login form
- [ ] Sign Up button navigates to registration form
- [ ] Skip link enters guest mode and navigates to Home
- [ ] Back button from forms returns to auth screen
- [ ] All animations play smoothly (60 FPS)

### Accessibility Tests
- [ ] VoiceOver reads all elements in correct order
- [ ] VoiceOver labels are clear and descriptive
- [ ] All touch targets are at least 44x44pt
- [ ] UI scales correctly with Dynamic Type (up to 200%)
- [ ] Color contrast meets WCAG AA standards

### Edge Case Tests
- [ ] Already in guest mode: skips auth screen
- [ ] Previously logged in: skips auth screen (if token valid)
- [ ] Network error: skip still works (guest mode is offline)
- [ ] Rapid tap on Skip: doesn't trigger multiple times
- [ ] Screen rotation: layout adapts correctly

### Form Validation Tests (Login/Sign Up)
- [ ] Invalid email shows error message
- [ ] Short password shows error message
- [ ] Valid input clears error messages
- [ ] Submit button disabled until form valid
- [ ] Network error on submit shows user-friendly message
