import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { ThemedTextInput } from '../components/ThemedTextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { plantService } from '../services/plant.service';
import { uploadService } from '../services/upload.service';
import { Plant } from '../types/plant';

export default function MyGardenScreen() {
  const navigation = useNavigation<any>();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlants = async () => {
    try {
      setLoading(true);
      const data = await plantService.getPlants();
      setPlants(data);
      setFilteredPlants(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load plants');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlants();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plant.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  }, [searchQuery, plants]);

  const renderPlantCard = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
    >
      {item.photos && item.photos.length > 0 && (
        <Image
          source={{ uri: uploadService.toFullUrl(item.photos[0]) }}
          style={styles.plantPhoto}
          resizeMode="cover"
        />
      )}
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{item.name}</Text>
        {item.location && (
          <Text style={styles.plantLocation}>📍 {item.location}</Text>
        )}
        {item.species && (
          <Text style={styles.plantSpecies}>{item.species.commonName}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🌱</Text>
      <Text style={styles.emptyStateTitle}>No Plants Yet</Text>
      <Text style={styles.emptyStateText}>
        Start your garden by adding your first plant!
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPlant')}
      >
        <Text style={styles.addButtonText}>Add Plant</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Garden</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('AddPlant')}
        >
          <Text style={styles.headerButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {plants.length > 0 && (
        <View style={styles.searchContainer}>
          <ThemedTextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Scrollable Plant List */}
      <FlatList
        data={filteredPlants}
        renderItem={renderPlantCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredPlants.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          searchQuery.trim() !== '' ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No plants found</Text>
              <Text style={styles.emptyStateText}>
                Try a different search term
              </Text>
            </View>
          ) : (
            renderEmptyState()
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  plantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  plantPhoto: {
    width: '100%',
    height: 200,
  },
  plantInfo: {
    padding: 16,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  plantLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  plantSpecies: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
