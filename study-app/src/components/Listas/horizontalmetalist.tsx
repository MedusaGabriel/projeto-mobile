import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { themas } from "../../global/themes";
import { format } from 'date-fns';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  dataConclusaoReal?: string;
  concluido: boolean;
  createdAt: string;
}

interface HorizontalMetasListProps {
    metas: Meta[];
    loading: boolean;
}

const HorizontalMetasList: React.FC<HorizontalMetasListProps> = ({ metas, loading }) => {
  const renderMeta = ({ item }: { item: Meta }) => {
    let formattedDate = item.dataConclusao;
    let dateLabel = "Previsão de conclusão:";
    let descricao = item.descricao;

    try {
      const date = new Date(item.dataConclusao);
      if (!isNaN(date.getTime())) {
        formattedDate = format(date, 'dd/MM/yyyy');
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error);
    }

    if (item.concluido && item.dataConclusaoReal) {
      try {
        const date = new Date(item.dataConclusaoReal);
        if (!isNaN(date.getTime())) {
          descricao = `Concluído em ${formattedDate}`;
        }
      } catch (error) {
        console.error("Erro ao formatar data de conclusão real:", error);
      }
    }

    return (
      <View style={[styles.card, item.concluido && { backgroundColor: themas.Colors.green }]}>
        <View style={styles.rowCard}>
          <View style={styles.rowCardLeft}>
            <View>
              <Text style={styles.titleCard}>{item.titulo}</Text>
              <Text>{descricao}</Text>
              <Text>{dateLabel} {formattedDate}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themas.Colors.primary} />
          <Text style={styles.loadingText}>Carregando metas...</Text>
        </View>
      ) : metas.length > 0 ? (
        <FlatList
          data={metas}
          renderItem={renderMeta}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.subtitulo}>Sem metas registradas, comece agora!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  card: {
    marginHorizontal: 10,
    width: 150,
    backgroundColor: themas.Colors.primary,
    minHeight: 80,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCard: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowCardLeft: {
    width: '80%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  subtitulo: {
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themas.Colors.bgScreen,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: themas.Colors.gray,
  },
});

export default HorizontalMetasList;