import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>⚡</Text>
        </View>

        {/* Title and Subtitle */}
        <Text style={styles.title}>AI-Powered{'\n'}Ultrasound{'\n'}Analysis</Text>
        <Text style={styles.subtitle}>
          High-precision breast cancer screening support with 95% accuracy, designed for clinical excellence.
        </Text>

        {/* Doctor Image Container */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80' }} 
            style={styles.doctorImage}
            resizeMode="cover"
          />
        </View>

        {/* Feature 1 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>✔️</Text>
            <Text style={styles.cardTitle}>Diagnostic Trust</Text>
          </View>
          <Text style={styles.cardText}>
            Validated by clinical datasets for rigorous accuracy.
          </Text>
        </View>

        {/* Feature 2 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⏱️</Text>
            <Text style={styles.cardTitle}>Real-time Processing</Text>
          </View>
          <Text style={styles.cardText}>
            Instant feedback loop for faster patient turnaround.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('Auth')} // Moves to Login Screen
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Space for the fixed button
  },
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#0052CC',
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0052CC',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#091E42',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#5E6C84',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  imageContainer: {
    borderRadius: 20,
    height: 280,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EBECF0',
    shadowColor: '#091E42',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#091E42',
  },
  cardText: {
    fontSize: 13,
    color: '#5E6C84',
    lineHeight: 18,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
    padding: 24,
    borderTopWidth: 1,
    borderColor: '#EBECF0',
  },
  button: {
    backgroundColor: '#0052CC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0052CC',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});