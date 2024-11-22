import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from '../services/firebaseConfig'; // Importe a configuração do Firebase
import { doc, getDoc } from 'firebase/firestore'; // Importa o método para obter dados do Firestore
import { onAuthStateChanged } from 'firebase/auth'; // Para obter o usuário autenticado
import { themas } from '../global/themes';

function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar o nome de usuário no Firestore
  const fetchUserName = async (uid: string) => {
    try {
      console.log('Buscando dados para o UID:', uid);
  
      // Referência ao documento do usuário no Firestore
      const userDoc = doc(firestore, 'users', uid); // 'users' é o nome da coleção, 'uid' é o ID do documento
      const docSnap = await getDoc(userDoc); // Obtém o documento do usuário
  
      if (docSnap.exists()) {
        // Se o documento existir, pega o campo 'username'
        const fullName = docSnap.data()?.username; // AQUI estamos buscando o campo 'username'
  
        // Dividir o nome completo e pegar apenas o primeiro nome
        const firstName = fullName ? fullName.split(' ')[0] : 'Usuário'; // Se houver um nome, pega a primeira parte
  
        // Tornar a primeira letra maiúscula e o restante minúscula
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  
        console.log('Primeiro nome do usuário encontrado:', capitalizedFirstName);
        setUserName(capitalizedFirstName); // Armazena o primeiro nome com a primeira letra maiúscula
      } else {
        console.log('Documento do usuário não encontrado.');
        Alert.alert('Erro', 'Usuário não encontrado no Firestore');
      }
    } catch (error) {
      console.error('Erro ao buscar o username do usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os dados do usuário');
    } finally {
      setLoading(false);
    }
  };
  

  // Efeito para capturar o UID do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuário logado:', user.uid);
        // Se o usuário estiver logado, busca o username no Firestore
        fetchUserName(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Limpa o ouvinte de mudanças de autenticação
  }, []);

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      {loading ? (
        <Text style={styles.text}>Olá, Carregando...</Text>
      ) : (
        <Text style={styles.text}>Olá, {userName}!</Text>
      )}
      <Text style={styles.textsecondary}>Tenha um ótimo dia!!</Text>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themas.Colors.bgScreen,
  },
  text: {
    fontSize: 20,
    color: themas.Colors.primary, 
    fontFamily: themas.Fonts.bold
  },
  textsecondary: {
    fontSize: 16,
    color: themas.Colors.lightGray, 
    fontFamily: themas.Fonts.regular
  }
});

export default Home;