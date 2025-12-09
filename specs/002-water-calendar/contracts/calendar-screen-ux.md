# Contract: Calendar Screen UX

## Screen Overview

The Calendar Screen provides a monthly calendar view showing water check events, overdue tasks management, and day-specific plant watering actions.

## Navigation

- **Tab Location**: Fourth tab in bottom navigation
- **Tab Label**: "Calendar"
- **Tab Icon**: Plant with water drop icon
- **Tab Order**: Home | Garden | Profile | **Calendar**

## Screen Layout

### Structure (Top to Bottom)

```
┌─────────────────────────────────────┐
│  Safe Area (Status Bar)             │
├─────────────────────────────────────┤
│  Header: "Calendar"                  │
├─────────────────────────────────────┤
│  [Pending Tasks Section]             │ ← Only if overdue events exist
│  - Overdue plant list                │
│  - Individual action buttons         │
├─────────────────────────────────────┤
│  Month Navigation                    │
│  ← December 2025 →                  │
├─────────────────────────────────────┤
│  [Day Detail Panel]                  │ ← Only when day selected
│  - Water checks for selected day    │
│  - Plant info + action buttons       │
├─────────────────────────────────────┤
│  Calendar Grid                       │
│  Sun Mon Tue Wed Thu Fri Sat        │
│  [Calendar cells with water drops]  │
│                                      │
│  (Scrollable)                        │
└─────────────────────────────────────┘
```

## Component Specifications

### 1. Header (Fixed)

```typescript
// Uses SafeAreaView with edges={['top']}
<SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Calendar</Text>
  </View>
</SafeAreaView>
```

**Styling**:
- Background: White (#fff)
- Height: Auto (padding-based)
- Padding: 16px horizontal, 12px vertical
- Border bottom: 1px solid #e0e0e0
- Title: 18px, bold, #333

### 2. Pending Tasks Section (Conditional)

**Display Condition**: Only shown when overdue water events exist (scheduledDate < today && status === 'PENDING')

```typescript
interface PendingTask {
  eventId: string;
  plantId: string;
  plantName: string;
  plantLocation?: string;
  plantPhoto?: string;
  scheduledDate: string;
  daysOverdue: number;
}
```

**Layout**:
```
┌─────────────────────────────────────┐
│  Pending Water Checks (3)            │
│                                      │
│  ┌───┬──────────────────┬──────┐   │
│  │ □ │ Monstera         │Water │   │
│  │img│ Living Room      │Skip  │   │
│  │   │ 2 days overdue   │      │   │
│  └───┴──────────────────┴──────┘   │
│                                      │
│  ┌───┬──────────────────┬──────┐   │
│  │ □ │ Snake Plant      │Water │   │
│  │img│ Bedroom          │Skip  │   │
│  │   │ 5 days overdue   │      │   │
│  └───┴──────────────────┴──────┘   │
└─────────────────────────────────────┘
```

**Styling**:
- Background: #FFF9E6 (light yellow warning)
- Padding: 16px
- Margin bottom: 12px
- Title: "Pending Water Checks ({count})" - 16px, bold, #D97706 (orange)
- Each plant card:
  - Background: White
  - Border radius: 8px
  - Padding: 12px
  - Margin bottom: 8px
  - Flex row layout
  - Plant photo: 60x60px, rounded
  - Plant name: 16px, bold, #333
  - Location: 14px, #666
  - Days overdue: 12px, #D97706 (orange)
  - Buttons: Same as day detail (see below)

### 3. Month Navigation (Fixed)

```
┌─────────────────────────────────────┐
│     ←  December 2025  →             │
└─────────────────────────────────────┘
```

**Styling**:
- Background: White
- Padding: 16px horizontal, 12px vertical
- Border bottom: 1px solid #e0e0e0
- Flex row, center aligned
- Month/Year text: 18px, bold, #333
- Arrow buttons: 32x32px touch target, ← and → symbols, color #4CAF50

**Interaction**:
- Left arrow: Navigate to previous month
- Right arrow: Navigate to next month
- Month label: Non-interactive

### 4. Day Detail Panel (Conditional)

**Display Condition**: Only shown when user taps a day with water events

```
┌─────────────────────────────────────┐
│  Water Checks for Dec 15            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                      │
│  ┌───┬──────────────────┬──────┐   │
│  │ □ │ Monstera         │Water │   │
│  │img│ Living Room      │Skip  │   │
│  └───┴──────────────────┴──────┘   │
│                                      │
│  ┌───┬──────────────────┬──────┐   │
│  │ □ │ Pothos           │Water │   │
│  │img│ Kitchen          │Skip  │   │
│  └───┴──────────────────┴──────┘   │
│                                      │
│  [Close ✕]                          │
└─────────────────────────────────────┘
```

**Styling**:
- Background: White
- Padding: 16px
- Border bottom: 2px solid #4CAF50
- Max height: 40% of screen (scrollable if more plants)
- Title: "Water Checks for {date}" - 16px, bold, #333
- Close button: Top right, 24x24px touch target, ✕ symbol, #666

**Plant Cards** (same as pending tasks but different colors):
- Background: #f5f5f5
- Plant photo: 80x80px, rounded corners (8px)
- Plant name: 18px, bold, #333
- Location: 14px, #666
- Button container: Flex row, gap 8px
- "Watered" button:
  - Background: #4CAF50 (green)
  - Text: White, 14px, bold
  - Padding: 8px 16px
  - Border radius: 6px
- "Not Ready Yet" button (or "Skip"):
  - Background: #E0E0E0 (light gray)
  - Text: #666, 14px
  - Padding: 8px 16px
  - Border radius: 6px

### 5. Calendar Grid (Scrollable)

```
┌─────────────────────────────────────┐
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat  │
│  ───  ───  ───  ───  ───  ───  ───  │
│   1    2    3    4    5    6    7   │
│   8    9   10   11   12   13   14   │
│  15💧 16   17💧 18   19   20   21   │
│  22   23   24   25   26   27   28   │
│  29   30   31                        │
└─────────────────────────────────────┘
```

**Styling**:
- Background: White
- Padding: 16px
- Week day headers:
  - Text: 12px, uppercase, #999
  - Margin bottom: 8px
  - Centered
- Day cells:
  - Size: (screen width - 32px - 48px gaps) / 7
  - Aspect ratio: 1:1 (square)
  - Border radius: 4px
  - Margin: 4px between cells
  - Text: 16px, centered
  - Default background: Transparent
  - Today background: #E8F5E9 (light green)
  - Selected day background: #4CAF50 (green)
  - Selected day text: White
  - Other month days: #CCC (light gray text)
  - Current month days: #333 (dark text)
- Water drop indicator:
  - Position: Bottom right of cell
  - Size: 16x16px
  - Icon: 💧 (or custom water drop SVG)
  - Color: #2196F3 (blue)

**Interaction**:
- Tap empty day: No action (or show "No checks scheduled" toast)
- Tap day with water drops: Show day detail panel
- Swipe left: Navigate to next month
- Swipe right: Navigate to previous month

## Loading States

### Initial Load
```
┌─────────────────────────────────────┐
│  Calendar                            │
├─────────────────────────────────────┤
│                                      │
│          [Loading Spinner]           │
│      Loading your water checks...    │
│                                      │
└─────────────────────────────────────┘
```

### Month Navigation Load
- Show subtle loading indicator in month label area
- Disable arrow buttons during load
- Keep calendar visible with previous month until new data loads

## Empty States

### No Plants
```
┌─────────────────────────────────────┐
│  Calendar                            │
├─────────────────────────────────────┤
│                                      │
│       [Plant Icon]                   │
│   No plants in your garden yet       │
│                                      │
│   Add plants to start tracking       │
│   their watering needs               │
│                                      │
│   [Go to My Garden →]                │
│                                      │
└─────────────────────────────────────┘
```

### No Water Checks This Month
```
┌─────────────────────────────────────┐
│     ←  December 2025  →             │
├─────────────────────────────────────┤
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat  │
│   1    2    3    4    5    6    7   │
│   8    9   10   11   12   13   14   │
│  15   16   17   18   19   20   21   │
│  22   23   24   25   26   27   28   │
│  29   30   31                        │
│                                      │
│  ℹ️ No water checks this month       │
└─────────────────────────────────────┘
```

## Error States

### Failed to Load
```
┌─────────────────────────────────────┐
│  Calendar                            │
├─────────────────────────────────────┤
│                                      │
│       [Error Icon]                   │
│   Failed to load water checks        │
│                                      │
│   [Try Again]                        │
│                                      │
└─────────────────────────────────────┘
```

### Failed to Complete Action
- Show alert/toast: "Failed to update water check. Please try again."
- Keep button enabled for retry

## Animations

- Day detail panel: Slide down from top (200ms ease-out)
- Day detail close: Slide up to top (200ms ease-in)
- Button press: Scale 0.95 (100ms)
- Month transition: Fade (150ms)
- Pending task removal: Fade out + slide up (200ms)

## Accessibility

- All interactive elements: Minimum 44x44pt touch target
- VoiceOver labels:
  - Day cells: "{date}, {water events count} water checks" or "{date}, no water checks"
  - Watered button: "Mark {plant name} as watered"
  - Skip button: "Postpone watering {plant name}"
  - Month navigation: "Previous month" / "Next month"
- Semantic HTML/React Native accessibility props
- High contrast mode support
- Reduced motion support (disable animations)

## Performance Requirements

- Initial load: < 500ms
- Month navigation: < 300ms
- Day detail panel open: < 100ms
- Button action response: Immediate (optimistic UI update)
- Smooth 60fps scrolling

## Integration Points

### API Calls

```typescript
// On screen load
GET /api/v1/water-events/overdue
GET /api/v1/water-events?startDate={monthStart}&endDate={monthEnd}

// On month navigation
GET /api/v1/water-events?startDate={monthStart}&endDate={monthEnd}

// On mark as watered
PATCH /api/v1/water-events/:id/complete
Body: { status: 'WATERED', completedDate: '2025-12-15T10:30:00Z' }

// On mark as postponed
PATCH /api/v1/water-events/:id/complete
Body: { status: 'POSTPONED', completedDate: '2025-12-15T10:30:00Z' }
```

### State Management

```typescript
interface CalendarScreenState {
  // Data
  currentMonth: Date;
  events: WaterEventWithPlant[];
  overdueEvents: WaterEventWithPlant[];
  selectedDay: Date | null;

  // UI State
  loading: boolean;
  loadingMonth: boolean;
  error: string | null;

  // Actions
  loadMonth: (date: Date) => Promise<void>;
  loadOverdue: () => Promise<void>;
  selectDay: (date: Date) => void;
  closeDay: () => void;
  completeEvent: (eventId: string, status: 'WATERED' | 'POSTPONED') => Promise<void>;
  previousMonth: () => void;
  nextMonth: () => void;
}
```

## File Location

- Screen: `/mobile/src/screens/CalendarScreen.tsx`
- Components:
  - `/mobile/src/components/calendar/PendingTasks.tsx`
  - `/mobile/src/components/calendar/MonthNavigation.tsx`
  - `/mobile/src/components/calendar/DayDetailPanel.tsx`
  - `/mobile/src/components/calendar/CalendarGrid.tsx`
  - `/mobile/src/components/calendar/WaterCheckCard.tsx`
- Service: `/mobile/src/services/water-event.service.ts`
- Types: `/mobile/src/types/water-event.ts`
