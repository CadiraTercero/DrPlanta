import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { WaterEvent, WaterEventStatus } from '../../types/water-event';
import WaterCheckCard from './WaterCheckCard';

interface DayDetailPanelProps {
  date: Date;
  events: WaterEvent[];
  onClose: () => void;
  onComplete: (
    eventId: string,
    status: WaterEventStatus.WATERED | WaterEventStatus.POSTPONED
  ) => void;
}

export default function DayDetailPanel({ date, events, onClose, onComplete }: DayDetailPanelProps) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;

  const handleWatered = (eventId: string) => {
    onComplete(eventId, WaterEventStatus.WATERED);
  };

  const handlePostpone = (eventId: string) => {
    onComplete(eventId, WaterEventStatus.POSTPONED);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Checks for {formattedDate}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.eventsList} contentContainerStyle={styles.eventsListContent}>
        {events.map((event) => (
          <WaterCheckCard
            key={event.id}
            event={event}
            onWatered={handleWatered}
            onPostpone={handlePostpone}
            variant="scheduled"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    maxHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  eventsList: {
    maxHeight: 240,
  },
  eventsListContent: {
    padding: 16,
  },
});
