# Contract: Profile Screen - Guest Mode UX

**Feature**: Optional Authentication (Guest Mode)
**Component**: Profile Screen
**Last Updated**: 2025-12-10

## Overview

The Profile Screen must support two distinct modes: Guest Mode (unauthenticated) and Authenticated Mode. This contract defines the UX requirements for both states with specific layouts, messaging, and interactions.

## Screen States

### State 1: Guest Mode (Unauthenticated)

**When**: User has skipped authentication and is using the app locally

**Layout**:
```
┌─────────────────────────────────────┐
│  ← Profile                          │ ← Header
├─────────────────────────────────────┤
│                                     │
│  👤                                 │ ← Large guest icon
│  Guest Mode                         │ ← Title (24pt, bold)
│  Your data is stored locally        │ ← Subtitle (14pt, gray)
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [Sign Up to Sync Data]             │ ← Primary button (green)
│                                     │
│  Already have an account?           │
│  [Log In]                           │ ← Link (blue, underlined)
│                                     │
├─────────────────────────────────────┤
│  ℹ️ Why sign up?                    │ ← Info section
│                                     │
│  ✓ Backup your plant data           │
│  ✓ Access from multiple devices     │
│  ✓ Never lose your plants           │
│                                     │
│  ⚠️ Local data will be lost if you │
│     uninstall the app without       │
│     signing up first.               │
│                                     │
├─────────────────────────────────────┤
│  Settings                           │ ← Menu items
│  About                              │
│  Privacy Policy                     │
│                                     │
└─────────────────────────────────────┘
```

**Elements**:

1. **Guest Icon**: Large (80x80pt) gray user icon
2. **Title**: "Guest Mode" - 24pt, bold, dark gray
3. **Subtitle**: "Your data is stored locally" - 14pt, regular, light gray
4. **Primary Button**: "Sign Up to Sync Data"
   - Full width (minus 32pt margins)
   - 48pt height
   - Green background (#4CAF50)
   - White text, bold
   - Border radius: 8pt
5. **Login Link**: "Already have an account? Log In"
   - Two lines: first line regular gray, second line blue and underlined
   - Tappable on "Log In" text
6. **Info Section**: Card with light background
   - Title: "ℹ️ Why sign up?" - 16pt, bold
   - Benefits: Checkmark + text (14pt)
   - Warning: ⚠️ emoji + text (12pt, orange-tinted background)
7. **Menu Items**: Standard list items (Settings, About, Privacy Policy)

**Interactions**:

| Element | Action | Navigation |
|---------|--------|------------|
| Sign Up button | Tap | → Registration screen |
| Log In link | Tap | → Login screen with guest data warning |
| Settings | Tap | → Settings screen |
| About | Tap | → About screen |
| Privacy Policy | Tap | → Privacy Policy screen |

**Data Display**:
- If user has local plants: Show count in subtitle: "5 plants stored locally"
- If no local plants: Show: "No data yet"

### State 2: Authenticated Mode

**When**: User has logged in or registered successfully

**Layout**:
```
┌─────────────────────────────────────┐
│  ← Profile                          │ ← Header
├─────────────────────────────────────┤
│                                     │
│  [User Photo or Avatar]             │ ← Profile image (80x80pt)
│  John Doe                           │ ← User name (20pt, bold)
│  john@example.com                   │ ← Email (14pt, gray)
│                                     │
│  Member since: Dec 2025             │ ← Join date (12pt, light gray)
│                                     │
├─────────────────────────────────────┤
│  ☁️ Synced                          │ ← Sync status (green)
│  Last sync: 2 minutes ago           │
│                                     │
├─────────────────────────────────────┤
│  📊 My Garden                       │ ← Stats section
│  15 Plants | 45 Care Logs          │
│                                     │
├─────────────────────────────────────┤
│  Settings                           │ ← Menu items
│  About                              │
│  Privacy Policy                     │
│  [Log Out]                          │ ← Destructive action (red)
│                                     │
└─────────────────────────────────────┘
```

**Elements**:

1. **Profile Image**: 80x80pt circle (user photo or initials avatar)
2. **User Name**: 20pt, bold, dark gray
3. **Email**: 14pt, regular, light gray
4. **Member Since**: 12pt, light gray, "Member since: [Month Year]"
5. **Sync Status**: Card with icon and status
   - ☁️ Synced (green) or ⚠️ Sync pending (orange)
   - Last sync time (relative: "2 minutes ago", "1 hour ago")
6. **Stats Section**: Garden statistics card
   - Icon + title + counts
7. **Menu Items**: Same as guest mode + Log Out
8. **Log Out Button**: Full-width, 48pt height, red text on white

**Interactions**:

| Element | Action | Navigation |
|---------|--------|------------|
| Profile Image | Tap | → Edit profile / Change photo |
| Settings | Tap | → Settings screen |
| About | Tap | → About screen |
| Privacy Policy | Tap | → Privacy Policy screen |
| Log Out | Tap | → Confirmation dialog → Logout → Auth screen |

### State 3: Syncing (Transition State)

**When**: User has just registered and data sync is in progress

**Layout**:
```
┌─────────────────────────────────────┐
│  Syncing Your Data...               │ ← Header (no back button)
├─────────────────────────────────────┤
│                                     │
│  ☁️                                 │ ← Animated cloud icon
│                                     │
│  [████████████░░░░░░] 75%          │ ← Progress bar
│                                     │
│  Uploading your plants...           │ ← Status message
│                                     │
│  ✓ Plants: 8/10                    │ ← Detailed progress
│  ✓ Photos: 15/20                   │
│  ⏳ Care logs: 45/50                │
│                                     │
│  Please don't close the app         │ ← Warning (light gray)
│                                     │
└─────────────────────────────────────┘
```

**Elements**:

1. **Header**: "Syncing Your Data..." - no back button (prevent interruption)
2. **Animation**: Cloud icon with pulsing/uploading animation
3. **Progress Bar**: Linear progress (0-100%)
4. **Status Message**: Current operation being performed
5. **Detailed Progress**: Checklist with counts
   - ✓ = completed
   - ⏳ = in progress
   - Empty = pending
6. **Warning**: "Please don't close the app" - 12pt, light gray

**Interactions**:
- **No interactions**: Screen is non-interactive during sync
- **Back button**: Disabled
- **Hardware back**: Shows confirmation: "Cancel sync? Local data will be kept for later"

**Sync Completion**:
- On success: Automatic transition to Authenticated Mode (State 2)
- On failure: Show error dialog with retry option

## User Flows

### Flow 1: Guest User Signs Up

```
[Profile Screen - Guest Mode]
         ↓ (Tap "Sign Up to Sync Data")
[Registration Screen]
         ↓ (Complete registration)
[Syncing Screen - State 3]
         ↓ (Sync completes)
[Profile Screen - Authenticated Mode]
```

### Flow 2: Guest User Logs In (with local data)

```
[Profile Screen - Guest Mode]
         ↓ (Tap "Log In")
[Warning Dialog]
┌─────────────────────────────────────┐
│ You have local data                 │
│                                     │
│ You have 5 plants and 20 care      │
│ logs stored locally.                │
│                                     │
│ What would you like to do?          │
│                                     │
│ [Sync to My Account]  ← Primary     │
│ [Discard Local Data]                │
│ [Cancel]                            │
└─────────────────────────────────────┘
         ↓ (User selects option)
[Login Screen]
         ↓ (Login successful)
If "Sync": [Syncing Screen] → [Profile - Authenticated]
If "Discard": [Profile - Authenticated] (local data cleared)
```

### Flow 3: Guest User Logs In (no local data)

```
[Profile Screen - Guest Mode]
         ↓ (Tap "Log In")
[Login Screen]
         ↓ (Login successful)
[Profile Screen - Authenticated Mode]
```

## Edge Cases

### No Internet During Registration

**Scenario**: User completes registration form but has no internet

**Behavior**:
1. Registration fails with error message
2. User stays in Guest Mode
3. Registration form data is preserved
4. Error: "No internet connection. Please try again when connected."

### Sync Failure Midway

**Scenario**: Sync starts but fails at 60% (e.g., network error)

**Behavior**:
1. Sync screen shows error dialog
2. Local data remains intact
3. Partially synced data is tracked
4. User can retry sync (resumes from failures)

**Error Dialog**:
```
┌─────────────────────────────────────┐
│ Sync Failed                         │
│                                     │
│ We couldn't sync all your data.     │
│ Your local data is safe.            │
│                                     │
│ 8/10 plants synced                  │
│ 15/20 photos synced                 │
│                                     │
│ [Retry Sync]  [Cancel]              │
└─────────────────────────────────────┘
```

### User Logs Out

**Scenario**: Authenticated user logs out

**Behavior**:
1. Show confirmation dialog
2. Clear authentication tokens
3. Keep cached data (read-only)
4. Transition to Guest Mode (new session, empty local storage)

**Confirmation Dialog**:
```
┌─────────────────────────────────────┐
│ Log Out?                            │
│                                     │
│ You'll need to log in again to      │
│ access your plants.                 │
│                                     │
│ [Log Out]  [Cancel]                 │
└─────────────────────────────────────┘
```

## Accessibility

### VoiceOver Support

| Element | Accessibility Label |
|---------|---------------------|
| Guest Icon | "Guest mode active" |
| Sign Up button | "Sign up to sync data. Double tap to create account and backup your plants." |
| Log In link | "Already have an account? Log in. Double tap to sign in." |
| Info section | "Information. Signing up backs up your plant data, allows access from multiple devices, and prevents data loss." |
| Sync progress | "Syncing plants. 8 of 10 completed. 75 percent complete." |

### Dynamic Type

- All text scales with system font size settings
- Minimum touch target: 44x44pt
- Layout adjusts for larger text (stacks if needed)

## Visual Design Specifications

### Colors

```typescript
const colors = {
  guestMode: {
    icon: '#9E9E9E',           // Gray
    title: '#212121',          // Dark gray
    subtitle: '#757575',       // Light gray
    primaryButton: '#4CAF50',  // Green
    warning: '#FFF3E0',        // Light orange background
    warningText: '#E65100',    // Orange text
  },
  authenticated: {
    syncSuccess: '#4CAF50',    // Green
    syncPending: '#FF9800',    // Orange
    logout: '#F44336',         // Red
  },
};
```

### Typography

```typescript
const typography = {
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontWeight: 'regular' },
  body: { fontSize: 16, fontWeight: 'regular' },
  caption: { fontSize: 12, fontWeight: 'regular' },
  button: { fontSize: 16, fontWeight: 'bold' },
};
```

### Spacing

```typescript
const spacing = {
  screenPadding: 16,       // Left/right margins
  sectionSpacing: 24,      // Between sections
  elementSpacing: 12,      // Between related elements
  cardPadding: 16,         // Inside cards
};
```

## Animation

### Sync Progress
- **Progress bar**: Linear animation, 300ms duration
- **Cloud icon**: Pulsing scale (1.0 → 1.1 → 1.0), 1s duration, infinite
- **Checkmarks**: Fade in + scale up (0.8 → 1.0), 200ms duration

### Transitions
- **Mode switch**: Fade out → Fade in, 300ms duration
- **Button press**: Scale down (1.0 → 0.95), 100ms duration

## Testing Checklist

- [ ] Guest mode displays correctly with 0 plants
- [ ] Guest mode displays plant count when user has local plants
- [ ] Sign Up button navigates to registration screen
- [ ] Log In link shows warning if local data exists
- [ ] Log In link navigates directly if no local data
- [ ] Sync progress updates in real-time
- [ ] Sync completes successfully and transitions to authenticated mode
- [ ] Sync failure shows error with retry option
- [ ] Authenticated mode displays user info correctly
- [ ] Sync status shows "Synced" or "Sync pending" accurately
- [ ] Log out shows confirmation and clears session
- [ ] VoiceOver reads all elements correctly
- [ ] UI scales correctly with Dynamic Type
- [ ] All buttons have 44x44pt touch targets
