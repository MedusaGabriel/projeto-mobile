import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { auth, firestore } from '../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { themas } from '../../global/themes';

type FetchAtividades = (
  setTotalAtividades: Dispatch<SetStateAction<number>>,
  setTotalConcluidas: Dispatch<SetStateAction<number>>,
  setTotalEmPausa: Dispatch<SetStateAction<number>>,
  setTotalEmAndamento: Dispatch<SetStateAction<number>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => Promise<void>;

const fetchAtividades: FetchAtividades = async (
  setTotalAtividades,
  setTotalConcluidas,
  setTotalEmPausa,
  setTotalEmAndamento,
  setLoading
) => {
  setLoading(true);
  try {
    const user = auth.currentUser;
    if (user) {
      const atividadesRef = collection(firestore, 'users', user.uid, 'atividades');
      const atividadesSnapshot = await getDocs(atividadesRef);
      const atividades = atividadesSnapshot.docs.map(doc => doc.data());
      setTotalAtividades(atividades.length);
      setTotalConcluidas(atividades.filter(atividade => atividade.status === 'concluido').length);
      setTotalEmPausa(atividades.filter(atividade => atividade.status === 'em pausa').length);
      setTotalEmAndamento(atividades.filter(atividade => atividade.status === 'em andamento').length);
    }
  } catch (error) {
    console.error('Erro ao buscar atividades do usuário:', error);
  } finally {
    setLoading(false);
  }
};

const AtividadesGraficos: React.FC = () => {
  const [totalAtividades, setTotalAtividades] = useState(0);
  const [totalConcluidas, setTotalConcluidas] = useState(0);
  const [totalEmPausa, setTotalEmPausa] = useState(0);
  const [totalEmAndamento, setTotalEmAndamento] = useState(0);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState([
    { name: 'Concluídas', count: 0, color: themas.Colors.green, legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Em Pausa', count: 0, color: themas.Colors.gray, legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Em Andamento', count: 0, color: themas.Colors.blueLigth, legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      fetchAtividades(setTotalAtividades, setTotalConcluidas, setTotalEmPausa, setTotalEmAndamento, setLoading);
    }, [])
  );

  useEffect(() => {
    setChartData([
      { name: 'Em Pausa', count: totalEmPausa, color: themas.Colors.gray, legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Em Andamento', count: totalEmAndamento, color: themas.Colors.blueLigth, legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Concluídas', count: totalConcluidas, color: themas.Colors.green, legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ]);
  }, [totalConcluidas, totalEmPausa, totalEmAndamento]);

  return (
    <View style={styles.container}>
      <View style={styles.viewAtividades}>
        <View style={styles.atividadeBox}>
          <Text style={[styles.text, { fontSize: 20 }]}>{totalAtividades}</Text>
          <Text style={styles.text}>Total de Atividades</Text>
        </View>

      </View>
      <View style={styles.card}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 80}
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
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
  viewAtividades: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  atividadeBox: {
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

export default AtividadesGraficos;