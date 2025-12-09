import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { WaterEvent, WaterEventStatus } from '../../types/water-event';

interface CalendarGridProps {
  currentMonth: Date;
  events: WaterEvent[];
  selectedDay: Date | null;
  onSelectDay: (date: Date) => void;
}

export default function CalendarGrid({
  currentMonth,
  events,
  selectedDay,
  onSelectDay,
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get calendar days including previous/next month days for complete weeks
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Add next month's days to complete the week
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  };

  // Check if a date has water events
  const hasWaterEvents = (date: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.scheduledDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        event.status === WaterEventStatus.PENDING
      );
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    if (!selectedDay) return false;
    return (
      date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear()
    );
  };

  const calendarDays = getCalendarDays();
  const screenWidth = Dimensions.get('window').width;
  const cellSize = (screenWidth - 32 - 48) / 7; // padding and gaps

  return (
    <View style={styles.container}>
      {/* Week day headers */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day) => (
          <View key={day} style={[styles.weekDayCell, { width: cellSize }]}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const hasEvents = hasWaterEvents(day.date);
          const today = isToday(day.date);
          const selected = isSelected(day.date);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                { width: cellSize, height: cellSize },
                today && styles.todayCell,
                selected && styles.selectedCell,
              ]}
              onPress={() => hasEvents && onSelectDay(day.date)}
              disabled={!hasEvents}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.isCurrentMonth && styles.otherMonthText,
                  selected && styles.selectedDayText,
                ]}
              >
                {day.date.getDate()}
              </Text>
              {hasEvents && (
                <Text style={styles.waterDrop}>💧</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Empty state if no events */}
      {events.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>ℹ️ No water checks this month</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayCell: {
    aspectRatio: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#E8F5E9',
  },
  selectedCell: {
    backgroundColor: '#4CAF50',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  otherMonthText: {
    color: '#CCC',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  waterDrop: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 12,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});
