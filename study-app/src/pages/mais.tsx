import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../services/firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { themas } from '../global/themes';
import { doc, getDoc } from 'firebase/firestore';
import MetasGraficos from '../components/Graficos/metasgraficos';
import { format, parse } from 'date-fns'; // Importando o format da date-fns

const Mais = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar apenas os dados do usuário
  const fetchUserData = async () => {
    setLoading(false);  // Marca o carregamento como ativo
    try {
      const user = auth.currentUser;
      if (user) {
        console.log('Buscando dados do usuário...');
        const userDoc = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserData(docSnap.data()); // Atualiza os dados do usuário
        } else {
          console.log('Usuário não encontrado no banco de dados');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false); // Define o estado de carregamento como falso após a execução
      console.log('Dados carregados.');
    }
  };

  // Chama a função para buscar dados do usuário apenas uma vez ao montar o componente
  useEffect(() => {
    fetchUserData();
  }, []);  // O array vazio significa que isso será executado apenas uma vez após o primeiro render

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout realizado com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Dados do Usuário</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themas.Colors.primary} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : userData ? (
          <View>
            <Text style={styles.text}>Nome: {userData?.username}</Text>
            <Text style={styles.text}>Email: {userData?.email}</Text>
            <Text style={styles.text}>Curso: {userData?.curso}</Text>
            <Text style={styles.text}>Data de Criação: {userData?.criação}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.text}>Usuário não encontrado</Text>
          </View>
        )}
      </View>  
      <MetasGraficos />
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <MaterialCommunityIcons 
          name="exit-to-app"
          size={30} 
          color={themas.Colors.blueLigth} 
        />
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.Colors.bgScreen,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 15,
    height: '26%',
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: themas.Fonts.bold,
    color: themas.Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themas.Colors.bgSecondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: themas.Fonts.bold,
    color: 'white',
    marginLeft: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
  },
});

export default Mais;