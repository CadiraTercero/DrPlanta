import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface MonthNavigationProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  loading?: boolean;
}

export default function MonthNavigation({
  currentMonth,
  onPrevious,
  onNext,
  onToday,
  loading = false,
}: MonthNavigationProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthYear = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  // Check if current month is the same as today's month
  const today = new Date();
  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={onPrevious}
          disabled={loading}
        >
          <Text style={[styles.arrowText, loading && styles.arrowDisabled]}>←</Text>
        </TouchableOpacity>

        <View style={styles.monthContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Text style={styles.monthText}>{monthYear}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.arrow}
          onPress={onNext}
          disabled={loading}
        >
          <Text style={[styles.arrowText, loading && styles.arrowDisabled]}>→</Text>
        </TouchableOpacity>
      </View>

      {!isCurrentMonth && (
        <TouchableOpacity
          style={styles.todayButton}
          onPress={onToday}
          disabled={loading}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  arrow: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  arrowDisabled: {
    color: '#CCC',
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center',
    minHeight: 24,
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  todayButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
