import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface MonthNavigationProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  loading?: boolean;
}

export default function MonthNavigation({
  currentMonth,
  onPrevious,
  onNext,
  loading = false,
}: MonthNavigationProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthYear = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
});
