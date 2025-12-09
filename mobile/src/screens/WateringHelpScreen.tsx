import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WateringHelpScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>How to Check if Your Plant Needs Water</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Finger Test</Text>
          <Text style={styles.sectionText}>
            Insert your finger about 2 inches (5 cm) into the soil. If it feels dry at that depth, it's time to water.
            If it still feels moist, wait a day or two before checking again.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Weight Test</Text>
          <Text style={styles.sectionText}>
            Lift your plant pot. If it feels light, the soil is likely dry and needs water.
            A well-watered pot will feel noticeably heavier.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Visual Inspection</Text>
          <Text style={styles.sectionText}>
            Check the soil surface. If it looks dry and has pulled away from the edges of the pot, it's time to water.
            Also look for wilting or drooping leaves, which can indicate thirst.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Moisture Meter</Text>
          <Text style={styles.sectionText}>
            For more precision, use a moisture meter. Insert it into the soil and it will give you a reading.
            Most plants prefer the soil to dry out slightly between waterings.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>When to Skip Watering</Text>
          <Text style={styles.warningText}>
            If the soil is still moist or the plant looks healthy and turgid, it's better to skip the scheduled watering.
            Overwatering is one of the most common causes of plant problems.
          </Text>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Different plants have different water needs. Succulents and cacti prefer to dry out completely,
            while tropical plants like consistent moisture. Always consider your plant's specific requirements.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  tipBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
});
