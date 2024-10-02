// src/pages/Materias.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Materias = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Materias teste</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Materias;
