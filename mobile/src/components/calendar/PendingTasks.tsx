import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WaterEvent, WaterEventStatus } from '../../types/water-event';
import WaterCheckCard from './WaterCheckCard';

interface PendingTasksProps {
  events: WaterEvent[];
  onComplete: (
    eventId: string,
    status: WaterEventStatus.WATERED | WaterEventStatus.POSTPONED
  ) => void;
}

export default function PendingTasks({ events, onComplete }: PendingTasksProps) {
  if (events.length === 0) return null;

  const handleWatered = (eventId: string) => {
    onComplete(eventId, WaterEventStatus.WATERED);
  };

  const handlePostpone = (eventId: string) => {
    onComplete(eventId, WaterEventStatus.POSTPONED);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pending Water Checks ({events.length})
      </Text>
      {events.map((event) => (
        <WaterCheckCard
          key={event.id}
          event={event}
          onWatered={handleWatered}
          onPostpone={handlePostpone}
          variant="overdue"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 12,
  },
});
