import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { plantService } from '../services/plant.service';
import { uploadService } from '../services/upload.service';
import { Plant } from '../types/plant';

export default function PlantDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { plantId } = route.params;

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlant();
  }, [plantId]);

  // Reload plant data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPlant();
    }, [plantId])
  );

  const loadPlant = async () => {
    try {
      setLoading(true);
      const data = await plantService.getPlant(plantId);
      setPlant(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load plant');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditPlant', { plantId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to remove ${plant?.name} from your garden?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await plantService.deletePlant(plantId);
              Alert.alert('Success', 'Plant removed from your garden', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete plant');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!plant) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plant.name}</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        {/* Photos Section */}
        {plant.photos && plant.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {plant.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: uploadService.toFullUrl(photo) }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          {plant.location && (
            <Text style={styles.location}>📍 {plant.location}</Text>
          )}
        </View>

        {plant.species && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Species Information</Text>
            <View style={styles.infoCard}>
              <Text style={styles.speciesName}>{plant.species.commonName}</Text>
              <Text style={styles.speciesLatin}>{plant.species.latinName}</Text>
              <Text style={styles.description}>
                {plant.species.shortDescription}
              </Text>

              <View style={styles.careInfo}>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>Light:</Text>
                  <Text style={styles.careValue}>
                    {plant.species.lightPreference}
                  </Text>
                </View>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>Water:</Text>
                  <Text style={styles.careValue}>
                    {plant.species.waterPreference}
                  </Text>
                </View>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>Humidity:</Text>
                  <Text style={styles.careValue}>
                    {plant.species.humidityPreference}
                  </Text>
                </View>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>Difficulty:</Text>
                  <Text style={styles.careValue}>{plant.species.difficulty}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {plant.acquisitionDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acquisition Date</Text>
            <Text style={styles.infoText}>
              {new Date(plant.acquisitionDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {plant.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.infoText}>{plant.notes}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Added to Garden</Text>
          <Text style={styles.infoText}>
            {new Date(plant.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Plant</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  deleteButtonContainer: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  speciesName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  speciesLatin: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  careInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  careItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    minWidth: '45%',
  },
  careLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 6,
  },
  careValue: {
    fontSize: 14,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  photosScroll: {
    marginTop: 8,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 12,
  },
});
