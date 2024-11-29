import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { themas } from '../global/themes';
import { auth, firestore } from '../services/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import HorizontalMetasList from '../components/Listas/horizontalmetalist';

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

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    weekDay: new Date(currentYear, currentMonth, i + 1).getDay(),
  }));

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

    setSelectedDay(currentDay);

    if (currentDay !== 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: currentDay - 1, animated: true });
      }, 100);
    }

    return () => unsubscribe();
  }, []);

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  const formatDayName = (dayIndex: number) => {
    const fullDaysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return fullDaysOfWeek[dayIndex];
  };

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      {loading ? (
        <Text style={styles.text}>Olá, Carregando...</Text>
      ) : (
        <Text style={styles.text}>Olá, {userName}!</Text>
      )}
      <Text style={styles.textsecondary}>Tenha um ótimo dia!!</Text>

      <View style={styles.calendarContainer}>
        <FlatList
          ref={flatListRef}
          data={monthDays}
          horizontal
          keyExtractor={(item) => item.day.toString()}
          getItemLayout={(data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
          onScrollToIndexFailed={(error) => {
            console.warn('Erro ao rolar para o índice:', error);
            flatListRef.current?.scrollToOffset({
              offset: error.averageItemLength * error.index,
              animated: true,
            });
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayItem,
                selectedDay === item.day && styles.selectedDay,
                currentDay === item.day && styles.todayHighlight,
              ]}
              onPress={() => handleDaySelect(item.day)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === item.day && styles.selectedDay,
                  currentDay === item.day && styles.todayText,
                ]}
              >
                {item.day}
              </Text>
              <Text style={styles.weekDayText}>
                {formatDayName(item.weekDay)}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.metasbox}>
        <Text style={styles.text}>Acompanhe suas Metas</Text>
        <HorizontalMetasList
          metas={goalsList}
          loading={loading}
        />
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
    marginBottom: 5,
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