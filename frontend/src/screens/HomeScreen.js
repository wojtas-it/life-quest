import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎮 LifeQuest</Text>
        <Text style={styles.subtitle}>Productivity RPG</Text>
        <Text style={styles.version}>v1.0.0</Text>
        <Text style={styles.status}>✅ Frontend initialized</Text>
        <Text style={styles.status}>✅ Backend ready</Text>
        <Text style={styles.status}>🚀 Ready to start coding!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#6BA3C7',
    marginBottom: 40,
  },
  version: {
    fontSize: 16,
    color: '#ADB5BD',
    marginBottom: 30,
  },
  status: {
    fontSize: 18,
    color: '#3DBFB0',
    marginVertical: 5,
  },
});

export default HomeScreen;
