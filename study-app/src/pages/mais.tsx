import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../services/firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { themas } from '../global/themes';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from "../components/Button"; // Importando o componente Button

const Mais = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('Usuário não encontrado no banco de dados');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout realizado com sucesso');
      navigation.reset({ routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      <Text style={styles.title}>Dados Pessoais</Text>
      <View style={styles.card}>
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
      <View style={styles.lougoutbox}>
      <Button
          text="Sair"
          onPress={handleLogout}
          textStyle={{ fontSize: 18, fontFamily: themas.Fonts.medium }}
          backgroundColor={{ backgroundColor: themas.Colors.blueLigth }}
          width="100%"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.Colors.bgScreen,
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 15,
    height: 120,
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
    padding: 20,
  },
  title: {
    fontSize: 20, 
    color: themas.Colors.primary, 
    fontFamily: themas.Fonts.bold,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.light,
    marginBottom: 2,
  },
  loadingContainer: {
    elevation: 5,
    height: "auto",
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
  },
  lougoutbox: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
});

export default Mais;