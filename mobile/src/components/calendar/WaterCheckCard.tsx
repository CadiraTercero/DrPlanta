import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { WaterEvent, WaterEventStatus } from '../../types/water-event';
import { CalendarStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<CalendarStackParamList>;

interface WaterCheckCardProps {
  event: WaterEvent;
  onWatered: (eventId: string) => void;
  onPostpone: (eventId: string) => void;
  variant?: 'overdue' | 'scheduled';
}

export default function WaterCheckCard({ event, onWatered, onPostpone, variant = 'scheduled' }: WaterCheckCardProps) {
  const plant = event.plant;
  const navigation = useNavigation<NavigationProp>();

  if (!plant) return null;

  // Calculate days overdue if overdue
  const getDaysOverdue = () => {
    const scheduledDate = new Date(event.scheduledDate);
    const today = new Date();
    const diffTime = today.getTime() - scheduledDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysOverdue = variant === 'overdue' ? getDaysOverdue() : 0;

  const handlePlantPress = () => {
    navigation.navigate('PlantDetail', { plantId: plant.id });
  };

  const handleHelpPress = () => {
    navigation.navigate('WateringHelp');
  };

  return (
    <View style={[styles.card, variant === 'overdue' ? styles.overdueCard : styles.scheduledCard]}>
      {/* Plant Info - Now Touchable */}
      <TouchableOpacity style={styles.plantInfoContainer} onPress={handlePlantPress}>
        {/* Plant Photo */}
        <View style={styles.photoContainer}>
          {plant.photos && plant.photos.length > 0 ? (
            <Image source={{ uri: plant.photos[0] }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>🌱</Text>
            </View>
          )}
        </View>

        {/* Plant Info */}
        <View style={styles.info}>
          <Text style={styles.plantName}>{plant.name}</Text>
          {plant.location && (
            <Text style={styles.location}>📍 {plant.location}</Text>
          )}
          {variant === 'overdue' && daysOverdue > 0 && (
            <Text style={styles.overdueText}>
              {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Help Button */}
      <IconButton
        icon="help-circle-outline"
        size={20}
        iconColor="#666"
        onPress={handleHelpPress}
        style={styles.helpButton}
      />

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.wateredButton}
          onPress={() => onWatered(event.id)}
        >
          <Text style={styles.wateredButtonText}>Water</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postponeButton}
          onPress={() => onPostpone(event.id)}
        >
          <Text style={styles.postponeButtonText}>Postpone</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  overdueCard: {
    backgroundColor: '#fff',
  },
  scheduledCard: {
    backgroundColor: '#f5f5f5',
  },
  plantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  helpButton: {
    margin: 0,
    marginHorizontal: 4,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  overdueText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  actions: {
    gap: 6,
  },
  wateredButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  wateredButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postponeButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  postponeButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
