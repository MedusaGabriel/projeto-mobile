import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Hoje = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Hoje</Text>
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

export default Hoje;
