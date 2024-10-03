import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Mais = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Mais</Text>
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

export default Mais;
