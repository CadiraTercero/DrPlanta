import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { waterEventService } from '../services/water-event.service';
import { WaterEvent, WaterEventStatus } from '../types/water-event';
import PendingTasks from '../components/calendar/PendingTasks';
import MonthNavigation from '../components/calendar/MonthNavigation';
import DayDetailPanel from '../components/calendar/DayDetailPanel';
import CalendarGrid from '../components/calendar/CalendarGrid';

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<WaterEvent[]>([]);
  const [overdueEvents, setOverdueEvents] = useState<WaterEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get start and end dates for the current month
  const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  };

  // Load events for the current month
  const loadMonth = async (date: Date) => {
    try {
      setLoadingMonth(true);
      const { startDate, endDate } = getMonthRange(date);
      console.log(`Loading events for date range: ${startDate} to ${endDate}`);
      const data = await waterEventService.getEventsForDateRange(startDate, endDate);
      console.log(`Loaded ${data.length} water events:`, data);
      setEvents(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load month events:', err);
      setError(err.message || 'Failed to load water checks');
      Alert.alert('Error', 'Failed to load water checks');
    } finally {
      setLoadingMonth(false);
    }
  };

  // Load overdue events
  const loadOverdue = async () => {
    try {
      const data = await waterEventService.getOverdueEvents();
      setOverdueEvents(data);
    } catch (err: any) {
      console.error('Failed to load overdue events:', err);
    }
  };

  // Initial load
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([loadMonth(currentMonth), loadOverdue()]);
        setLoading(false);
      };
      loadData();
    }, [])
  );

  // Reload month when currentMonth changes
  useEffect(() => {
    if (!loading) {
      loadMonth(currentMonth);
    }
  }, [currentMonth]);

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Navigate to today's month
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Handle day selection
  const selectDay = (date: Date) => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.scheduledDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        event.status === WaterEventStatus.PENDING
      );
    });

    if (dayEvents.length > 0) {
      setSelectedDay(date);
    }
  };

  // Close day detail panel
  const closeDay = () => {
    setSelectedDay(null);
  };

  // Complete a water event
  const completeEvent = async (eventId: string, action: WaterEventStatus.WATERED | WaterEventStatus.POSTPONED) => {
    try {
      const completedDate = new Date().toISOString();
      await waterEventService.completeWaterEvent(eventId, {
        action,
        completedDate,
      });

      // Optimistically update UI
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setOverdueEvents((prev) => prev.filter((e) => e.id !== eventId));

      // Reload data to get newly created events
      await Promise.all([loadMonth(currentMonth), loadOverdue()]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update water check');
    }
  };

  // Get events for selected day
  const getSelectedDayEvents = () => {
    if (!selectedDay) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.scheduledDate);
      return (
        eventDate.getDate() === selectedDay.getDate() &&
        eventDate.getMonth() === selectedDay.getMonth() &&
        eventDate.getFullYear() === selectedDay.getFullYear() &&
        event.status === WaterEventStatus.PENDING
      );
    });
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your water checks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to load water checks</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadMonth(currentMonth)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Pending Tasks */}
        {overdueEvents.length > 0 && (
          <PendingTasks events={overdueEvents} onComplete={completeEvent} />
        )}

        {/* Month Navigation */}
        <MonthNavigation
          currentMonth={currentMonth}
          onPrevious={previousMonth}
          onNext={nextMonth}
          onToday={goToToday}
          loading={loadingMonth}
        />

        {/* Day Detail Panel */}
        {selectedDay && (
          <DayDetailPanel
            date={selectedDay}
            events={getSelectedDayEvents()}
            onClose={closeDay}
            onComplete={completeEvent}
          />
        )}

        {/* Calendar Grid */}
        <CalendarGrid
          currentMonth={currentMonth}
          events={events}
          selectedDay={selectedDay}
          onSelectDay={selectDay}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
