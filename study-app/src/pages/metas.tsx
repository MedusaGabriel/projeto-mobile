import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { themas } from '../global/themes';
import { AntDesign } from '@expo/vector-icons';
import { useGoal } from '../components/Modal/metasmodal';
import MetasList from '../components/Listas/metaslist';
export default function Metas() {
  const { onOpen } = useGoal();

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      <Text style={styles.title}>Minhas Metas</Text>
      <TouchableOpacity style={styles.button} onPress={onOpen}>
        <AntDesign name="plus" size={40} color={themas.Colors.primary} />
      </TouchableOpacity>
      <MetasList />
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
  },
  button: {
    position: "absolute",
    bottom: 15,
    width: 50,  // Tamanho do botão
    height: 50, // Tamanho do botão
    backgroundColor: themas.Colors.blueLigth, // Cor de fundo azul
    borderRadius: 30, // Botão redondo
    justifyContent: 'center', // Centralizar o conteúdo dentro do botão
    alignItems: 'center', // Centralizar o conteúdo dentro do botão
    elevation: 5,  // Sombra para um efeito 3D
  },
  buttonText: {
    fontSize: 16,
    fontFamily: themas.Fonts.bold,
  },
});