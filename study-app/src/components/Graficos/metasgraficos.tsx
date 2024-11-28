import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native'; // Importando para uso correto de foco
import { auth, firestore } from '../../services/firebaseConfig'; // Importação para o Firestore
import { collection, getDocs } from 'firebase/firestore';
import { themas } from '../../global/themes'; // Importação de temas

// Função para buscar apenas as metas do usuário
const fetchMetas = async (setTotalMetas: { (value: React.SetStateAction<number>): void; (arg0: number): void; }, setTotalMetasConcluidas: { (value: React.SetStateAction<number>): void; (arg0: number): void; }, setLoading: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  setLoading(true); // Marca o carregamento como ativo
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
    setLoading(false); // Finaliza o carregamento
  }
};

const MetasGraficos: React.FC = () => {
  const [totalMetas, setTotalMetas] = useState(0);
  const [totalMetasConcluidas, setTotalMetasConcluidas] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dados para o gráfico
  const chartData = {
    labels: ['Metas Concluídas', 'Metas Pendentes'],
    datasets: [
      {
        data: [totalMetasConcluidas, totalMetas - totalMetasConcluidas],
      },
    ],
  };

  // Usar useFocusEffect para recarregar os dados sempre que a tela ganhar o foco
  useFocusEffect(
    React.useCallback(() => {
      fetchMetas(setTotalMetas, setTotalMetasConcluidas, setLoading); // Chama a função sempre que a página for exibida
    }, []) // Esse array vazio significa que será executado apenas uma vez quando a tela ganhar foco
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Progresso das Metas</Text>
        <View style={styles.progressContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themas.Colors.primary} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
          ) : (
            <>
            <View>
              <Text style={styles.text}>Total de Metas: {totalMetas}</Text>
              <Text style={styles.text}>Metas Concluídas: {totalMetasConcluidas}</Text>
              <BarChart
                style={styles.chart}
                data={chartData}
                width={Dimensions.get('window').width - 80} // Ajuste da largura para a tela
                height={220}
                fromZero={true}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  propsForHorizontalLabels: {
                    fontSize: 14,
                    fontFamily: themas.Fonts.regular,
                    transform: [{ translateX: -35}, { translateY: -4}],
                  },
                  backgroundGradientFrom: themas.Colors.bgSecondary,
                  backgroundGradientTo: themas.Colors.bgSecondary,
                  decimalPlaces: 0,
                  propsForVerticalLabels: {
                    fontSize: 12,
                    fontFamily: themas.Fonts.bold,
                  },
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, 
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: themas.Colors.primary,
                  },
                }}
                />
            </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    marginBottom : 20,
  },
  card: {
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 15,
    paddingTop: 20,
    height: 'auto',
    width: '100%', // Largura do card ajustada para 90% da tela
    maxWidth: 400, // Limita a largura máxima para o card (para telas muito grandes)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontFamily: themas.Fonts.bold,
    color: themas.Colors.primary,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
  },
  progressContainer: {
    alignItems: 'center',
    height: 300, // Tamanho fixo para a box de gráficos
    justifyContent: 'center', // Alinha o conteúdo ao centro enquanto carrega
    width: '100%', // Garante que o gráfico ocupe a largura disponível
  },
  chart: {
    marginVertical: 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: themas.Colors.primary,
    fontFamily: themas.Fonts.regular,
  },
});

export default MetasGraficos;
