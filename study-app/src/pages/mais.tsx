import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig'; // Sua configuração do Firebase
import { useNavigation,NavigationProp  } from '@react-navigation/native'; // Hook de navegação
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Biblioteca de ícones
import { themas } from '../global/themes';

const Mais = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  // Função de logout
  const handleLogout = async () => {
    try {
      // Fazendo logout do Firebase
      await signOut(auth);
      console.log('Logout realizado com sucesso');

      // Redirecionando para a tela de login
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={[{ paddingTop: 50 }, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.text}>Fazer Logout</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <MaterialCommunityIcons 
            name="exit-to-app" 
            size={30}
            color="black" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.Colors.bgScreen,
    flex: 1,
    justifyContent: 'flex-start',  // Alinha o conteúdo no final (parte inferior)
    alignItems: 'flex-end',  // Alinha o conteúdo à direita
    padding: 20,  // Adiciona um pouco de espaço nas bordas
  },
  content: {
    flexDirection: 'row',  // Organiza o texto e o ícone lado a lado
    alignItems: 'center',  // Alinha o texto e o ícone verticalmente
  },
  text: {
    marginRight: 1,// Adiciona espaço entre o texto e o ícone
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    padding: 5,  // Reduzindo o padding para diminuir o tamanho do botão
    backgroundColor: themas.Colors.bgScreen,  // Exemplo de cor de fundo, pode ser ajustada
    borderRadius: 25,  // Torna o botão arredondado
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Mais;
