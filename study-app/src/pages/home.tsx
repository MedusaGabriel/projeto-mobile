import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../services/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { themas } from '../global/themes';

function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const flatListRef = useRef<FlatList>(null); // Referência para o FlatList

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
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
                {formatDayName(item.weekDay)} {/* Exibe o nome do dia da semana */}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Removi a parte que exibia "Dia 27" abaixo do calendário */}
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
});

export default Home;
