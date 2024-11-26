import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { themas } from '../global/themes';

function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Lista fixa dos dias da semana
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Dia atual
  const today = new Date();
  const currentDay = today.getDate();
  const currentWeekday = today.getDay();

  // Função para calcular as datas dos dias da semana (passados e futuros)
  const getDayDates = () => {
    const dates = [];
    for (let i = -currentWeekday; i <= 6 - currentWeekday; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.getDate());
    }
    return dates;
  };

  const weekDates = getDayDates();

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

    return () => unsubscribe();
  }, []);

  // Função para definir o dia selecionado
  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
  };

  // Função para formatar o nome do dia por extenso
  const formatDayName = (index: number) => {
    const fullDaysOfWeek = ['Domingo', 'Segunda-feira,', 'Terça-feira,', 'Quarta-feira,', 'Quinta-feira,', 'Sexta-feira,', 'Sábado,'];
    return fullDaysOfWeek[index];
  };

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      {/* Header */}
      {loading ? (
        <Text style={styles.text}>Olá, Carregando...</Text>
      ) : (
        <Text style={styles.text}>Olá, {userName}!</Text>
      )}
      <Text style={styles.textsecondary}>Tenha um ótimo dia!!</Text>

      {/* Calendário Horizontal */}
      <View style={styles.calendarContainer}>
        <FlatList
          data={daysOfWeek}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.dayItem, selectedDay === index && styles.selectedDay]} // Destaca o dia selecionado
              onPress={() => handleDaySelect(index)} // Ao clicar, seleciona o dia
            >
              {/* Nome do dia da semana (abreviado) */}
              <Text
                style={[
                  styles.dayText,
                  selectedDay === index && styles.selectedDayText, // Destaque para o dia selecionado
                ]}
              >
                {item}
              </Text>
              {/* Número do dia */}
              <Text
                style={[
                  styles.dateText,
                  selectedDay === index && styles.selectedDateText, // Destaca a data do dia selecionado
                ]}
              >
                {weekDates[index]} {/* Exibe a data */}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Exibição do "O que temos para hoje?" abaixo do calendário */}
      <View style={styles.todayContainer}>
        {selectedDay === currentWeekday ? (
          <Text style={styles.todayText}>O que temos para hoje?</Text>
        ) : null}
      </View>

      {/* Exibição do dia selecionado abaixo do calendário */}
      <View style={styles.selectedDayContainer}>
        <Text style={styles.selectedDayText}>
          {selectedDay === null
            ? 'Selecione um dia'
            : `${formatDayName(selectedDay)} ${weekDates[selectedDay]}`}
        </Text>
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
    height: 70,
    marginVertical: 10,
    justifyContent: 'center',
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  dayText: {
    fontSize: 14,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
  },
  dateText: {
    fontSize: 12,
    color: themas.Colors.lightGray,
    fontFamily: themas.Fonts.regular,
  },
  selectedDay: {
    backgroundColor: themas.Colors.blueLigth, // Destaca o fundo do dia selecionado
    borderRadius: 5,
  },
  selectedDateText: {
    color: themas.Colors.bgSecondary,
    fontWeight: 'bold',
  },
  todayContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  todayText: {
    fontSize: 18,
    color: themas.Colors.blueLigth,
    fontWeight: 'bold',
  },
  selectedDayContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  selectedDayText: {
    color: themas.Colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Home;
