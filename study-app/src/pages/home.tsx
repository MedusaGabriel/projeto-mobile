import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { themas } from '../global/themes';
import { auth, firestore } from '../services/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import MetasGraficos from '../components/Graficos/metasgraficos';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  dataConclusaoReal?: string;
  concluido: boolean;
  createdAt: string;
}

function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [goalsList, setGoalsList] = useState<Meta[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const fetchUserName = async (uid: string) => {
    try {
      const userDoc = doc(firestore, 'users', uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const fullName = docSnap.data()?.username;
        const firstName = fullName ? fullName.split(' ')[0] : 'Usuário';
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        setUserName(capitalizedFirstName);
      }
    } catch (error) {
      console.error('Erro ao buscar o username do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetas = async (uid: string) => {
    try {
      const metasRef = collection(firestore, 'users', uid, 'metas');
      const querySnapshot = await getDocs(metasRef);
      const metasList: Meta[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        metasList.push({
          id: doc.id,
          titulo: data.titulo,
          descricao: data.descricao,
          dataConclusao: data.dataConclusao,
          dataConclusaoReal: data.dataConclusaoReal,
          concluido: data.concluido || false,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      metasList.sort((a, b) => {
        if (a.concluido && !b.concluido) return 1;
        if (!a.concluido && b.concluido) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setGoalsList(metasList);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
        fetchMetas(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      {loading ? (
        <Text style={styles.text}>Olá, Carregando...</Text>
      ) : (
        <Text style={styles.text}>Olá, {userName}!</Text>
      )}
      <Text style={styles.textsecondary}>Acompanhe seu progresso!!</Text>
      <MetasGraficos />
      <View style={styles.metasbox}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themas.Colors.bgScreen,
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 20,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.bold,
    marginBottom: 5,
  },
  textsecondary: {
    fontSize: 16,
    color: themas.Colors.lightGray,
    fontFamily: themas.Fonts.regular,
    marginBottom: 20,
  },
  calendarContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
  },
  weekDayText: {
    fontSize: 10,
    color: themas.Colors.lightGray,
    fontFamily: themas.Fonts.regular,
  },
  selectedDay: {
    backgroundColor: themas.Colors.blueLigth,
    borderRadius: 5,
  },
  todayHighlight: {
    borderColor: themas.Colors.blueLigth,
    borderWidth: 2,
    borderRadius: 5,
  },
  todayText: {
    fontWeight: 'bold',
    color: themas.Colors.primary,
  },
  metasbox: {
    height: 190,
    marginTop: 20,
  },
});

export default Home;