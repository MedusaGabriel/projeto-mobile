import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { auth, firestore } from '../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { themas } from '../../global/themes';

type FetchMetas = (
  setTotalMetas: Dispatch<SetStateAction<number>>,
  setTotalMetasConcluidas: Dispatch<SetStateAction<number>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => Promise<void>;

const fetchMetas: FetchMetas = async (setTotalMetas, setTotalMetasConcluidas, setLoading) => {
  setLoading(true);
  try {
    const user = auth.currentUser;
    if (user) {
      const metasRef = collection(firestore, 'users', user.uid, 'metas');
      const metasSnapshot = await getDocs(metasRef);
      const metas = metasSnapshot.docs.map(doc => doc.data());
      setTotalMetas(metas.length);
      setTotalMetasConcluidas(metas.filter(meta => meta.concluido).length);
    }
  } catch (error) {
    console.error('Erro ao buscar metas do usuário:', error);
  } finally {
    setLoading(false);
  }
};

const MetasGraficos: React.FC = () => {
  const [totalMetas, setTotalMetas] = useState(0);
  const [totalMetasConcluidas, setTotalMetasConcluidas] = useState(0);
  const [loading, setLoading] = useState(true);

  const animatedMetasConcluidas = useRef(new Animated.Value(0)).current;
  const animatedMetasPendentes = useRef(new Animated.Value(0)).current;

  const [chartData, setChartData] = useState({
    labels: ['Metas Concluídas', 'Metas Pendentes'],
    datasets: [
      {
        data: [0, 0],
      },
    ],
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchMetas(setTotalMetas, setTotalMetasConcluidas, setLoading);
    }, [])
  );

  useEffect(() => {
    const metasPendentes = totalMetas - totalMetasConcluidas;

    // Animate 'Metas Concluídas'
    Animated.timing(animatedMetasConcluidas, {
      toValue: totalMetasConcluidas,
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Animate 'Metas Pendentes'
    Animated.timing(animatedMetasPendentes, {
      toValue: metasPendentes,
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Update chart data based on animation
    animatedMetasConcluidas.addListener(({ value }) => {
      setChartData(prevData => ({
        ...prevData,
        datasets: [
          {
            data: [value, metasPendentes],
          },
        ],
      }));
    });

    animatedMetasPendentes.addListener(({ value }) => {
      setChartData(prevData => ({
        ...prevData,
        datasets: [
          {
            data: [totalMetasConcluidas, value],
          },
        ],
      }));
    });

    // Cleanup listeners when the component unmounts
    return () => {
      animatedMetasConcluidas.removeAllListeners();
      animatedMetasPendentes.removeAllListeners();
    };
  }, [totalMetas, totalMetasConcluidas]);

  return (
    <View style={styles.container}>
      <View style={styles.viewMetas}>
        <View style={styles.metaBox}>
          <Text style={[styles.text, { fontSize: 20 }]}>{totalMetas}</Text>
          <Text style={styles.text}>Total de Metas</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={[styles.text, { fontSize: 20 }]}>{totalMetasConcluidas}</Text>
          <Text style={styles.text}>Metas Concluídas</Text>
        </View>
      </View>
      <View style={styles.card}>
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 80}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            propsForHorizontalLabels: {
              fontSize: 14,
              fontFamily: themas.Fonts.regular,
              transform: [{ translateX: -35}, { translateY: -4}],
            },
            propsForVerticalLabels: {
              fontSize: 12,
              fontFamily: themas.Fonts.semiBold,
            },
            backgroundGradientFrom: themas.Colors.bgSecondary,
            backgroundGradientTo: themas.Colors.bgSecondary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.medium,
  },
  viewMetas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  metaBox: {
    flex: 1,
    backgroundColor: themas.Colors.bgSecondary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  card: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 15,
    height: 240,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default MetasGraficos;