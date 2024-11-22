import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MetaModal from '../components/Modal/metasmodal';
import { themas } from '../global/themes';

export default function App() {

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      <Text style={styles.title}>Minhas Metas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: themas.Colors.bgScreen,
    alignItems: 'center',
  },
  title: { 
    fontSize: 20, 
    color: themas.Colors.primary, 
    fontFamily: themas.Fonts.bold
  }
});
