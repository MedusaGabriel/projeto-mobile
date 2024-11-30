import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "../../global/themes";
import { format } from 'date-fns';
import { useActivity } from "../Context/authcontextatividades";

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  icon: string;
  color: string;
  status: string;
}

const renderActivity = ({ item }: { item: Activity }) => {
  let formattedDate = 'Data inválida';
  if (item.dataConclusao) {
    const parsedDate = Date.parse(item.dataConclusao);
    if (!isNaN(parsedDate)) {
      formattedDate = format(new Date(parsedDate), 'dd/MM/yyyy');
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <MaterialIcons name={item.icon as any} size={30} color={item.color} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.description}>{item.descricao}</Text>
          <Text style={styles.date}>Data prevista para conclusão: {formattedDate}</Text>
          <Text style={styles.date}>Status: {item.status}</Text>
        </View>
      </View>
    </View>
  );
};

const AtividadesList = () => {
  const [loading, setLoading] = useState(true);
  const { activitiesList, fetchActivities } = useActivity();

  useEffect(() => {
    const loadActivities = async () => {
      await fetchActivities();
      setLoading(false);
    };

    loadActivities();
  }, [fetchActivities]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themas.Colors.primary} />
          <Text style={styles.loadingText}>Carregando atividades...</Text>
        </View>
      ) : activitiesList.length > 0 ? (
        <FlatList
          data={activitiesList}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.subtitulo}>Sem atividades registradas, comece agora!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: themas.Colors.gray,
  },
  flatList: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1, // Adiciona flex para ocupar o espaço disponível
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themas.Colors.primary,
  },
  description: {
    fontSize: 14,
    color: themas.Colors.gray,
    width: '100%', // ou qualquer valor desejado, por exemplo, '80%' ou 200
  },
  date: {
    fontSize: 12,
    color: themas.Colors.secondary,
  },
  subtitulo: {
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AtividadesList;