import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { plantService } from '../services/plant.service';
import { plantSpeciesService } from '../services/plant-species.service';
import { uploadService } from '../services/upload.service';
import { CreatePlantDto, PlantSpecies } from '../types/plant';
import { format } from 'date-fns';

export default function AddPlantScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState<CreatePlantDto>({
    name: '',
    location: '',
    acquisitionDate: '',
    notes: '',
    photos: [],
    speciesId: undefined,
  });

  // Species search state
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [searchingSpecies, setSearchingSpecies] = useState(false);
  const [speciesResults, setSpeciesResults] = useState<PlantSpecies[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies | null>(null);
  const [showSpeciesResults, setShowSpeciesResults] = useState(false);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Search species
  const handleSpeciesSearch = async (query: string) => {
    setSpeciesQuery(query);

    if (query.length < 2) {
      setSpeciesResults([]);
      setShowSpeciesResults(false);
      return;
    }

    try {
      setSearchingSpecies(true);
      const results = await plantSpeciesService.searchSpecies(query);
      setSpeciesResults(results);
      setShowSpeciesResults(true);
    } catch (error: any) {
      console.error('Species search error:', error);
    } finally {
      setSearchingSpecies(false);
    }
  };

  const handleSelectSpecies = (species: PlantSpecies) => {
    setSelectedSpecies(species);
    setSpeciesQuery(species.commonName);
    setFormData({ ...formData, speciesId: species.id });
    setShowSpeciesResults(false);
  };

  const handleClearSpecies = () => {
    setSelectedSpecies(null);
    setSpeciesQuery('');
    setFormData({ ...formData, speciesId: undefined });
    setSpeciesResults([]);
    setShowSpeciesResults(false);
  };

  // Date handling
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        acquisitionDate: format(date, 'yyyy-MM-dd'),
      });
    }
  };

  const handleClearDate = () => {
    setFormData({ ...formData, acquisitionDate: '' });
  };

  // Photo handling
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload photos.');
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleUploadImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    const { status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleUploadImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleUploadImage = async (uri: string) => {
    try {
      setUploadingPhoto(true);
      const url = await uploadService.uploadPlantPhoto(uri);
      setFormData({
        ...formData,
        photos: [...(formData.photos || []), url],
      });
    } catch (error: any) {
      Alert.alert('Upload Error', error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...(formData.photos || [])];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Plant name is required');
      return;
    }

    try {
      setLoading(true);
      await plantService.createPlant({
        ...formData,
        name: formData.name.trim(),
        location: formData.location?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        acquisitionDate: formData.acquisitionDate?.trim() || undefined,
      });
      Alert.alert('Success', 'Plant added to your garden!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Plant</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Photos Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photosContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {formData.photos?.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photoThumbnail} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Text style={styles.removePhotoText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() =>
                  Alert.alert('Add Photo', 'Choose an option', [
                    { text: 'Take Photo', onPress: handleTakePhoto },
                    { text: 'Choose from Library', onPress: handlePickImage },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <ActivityIndicator color="#4CAF50" />
                ) : (
                  <Text style={styles.addPhotoText}>+</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Plant Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plant Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Monstera Deliciosa"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        {/* Species Search */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Species</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Search for plant species..."
              value={speciesQuery}
              onChangeText={handleSpeciesSearch}
              editable={!selectedSpecies}
            />
            {searchingSpecies && (
              <ActivityIndicator
                style={styles.speciesSearchSpinner}
                color="#4CAF50"
                size="small"
              />
            )}
            {selectedSpecies && (
              <View style={styles.selectedSpeciesContainer}>
                <View style={styles.selectedSpeciesInfo}>
                  <Text style={styles.selectedSpeciesName}>
                    {selectedSpecies.commonName}
                  </Text>
                  <Text style={styles.selectedSpeciesLatin}>
                    {selectedSpecies.latinName}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClearSpecies}>
                  <Text style={styles.clearSpeciesButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {showSpeciesResults && speciesResults.length > 0 && (
            <View style={styles.speciesResultsContainer}>
              {speciesResults.map((species) => (
                <TouchableOpacity
                  key={species.id}
                  style={styles.speciesResultItem}
                  onPress={() => handleSelectSpecies(species)}
                >
                  <Text style={styles.speciesResultName}>{species.commonName}</Text>
                  <Text style={styles.speciesResultLatin}>{species.latinName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Living Room"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        {/* Acquisition Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Acquisition Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={formData.acquisitionDate ? styles.dateText : styles.datePlaceholder}>
              {formData.acquisitionDate || 'Select date'}
            </Text>
            {formData.acquisitionDate && (
              <TouchableOpacity onPress={handleClearDate} style={styles.clearDateButton}>
                <Text style={styles.clearDateText}>✕</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes about your plant..."
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButtonContainer}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Plant</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  content: {
    flex: 1,
    padding: 16,
  },
  saveButtonContainer: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  // Photos
  photosContainer: {
    flexDirection: 'row',
  },
  photoWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f44336',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  addPhotoText: {
    fontSize: 40,
    color: '#4CAF50',
  },
  // Species
  speciesSearchSpinner: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  selectedSpeciesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  selectedSpeciesInfo: {
    flex: 1,
  },
  selectedSpeciesName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedSpeciesLatin: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  clearSpeciesButton: {
    fontSize: 20,
    color: '#666',
    padding: 8,
  },
  speciesResultsContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 200,
  },
  speciesResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  speciesResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  speciesResultLatin: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  // Date Picker
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  clearDateButton: {
    padding: 4,
  },
  clearDateText: {
    fontSize: 18,
    color: '#666',
  },
});
