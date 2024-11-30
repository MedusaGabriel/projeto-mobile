import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { themas } from "../../global/themes";
import { db } from "../../services/firebaseConfig";
import { format } from 'date-fns';

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  icon: string;
  color: string;
}

const AtividadesList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
  
    useEffect(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
    }, []);
  
    useEffect(() => {
      if (userId) {
        const fetchActivities = async () => {
          try {
            const activitiesRef = collection(db, "users", userId, "atividades");
            const querySnapshot = await getDocs(activitiesRef);
            const activitiesList: Activity[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              activitiesList.push({
                id: doc.id,
                titulo: data.titulo,
                descricao: data.descricao,
                dataConclusao: data.dataConclusao,
                icon: data.icon,
                color: data.color,
              });
            });
            setActivitiesList(activitiesList);
          } catch (error) {
            console.error("Erro ao buscar atividades:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchActivities();
      }
    }, [userId]);
  
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
        <Text style={styles.noActivitiesText}>Sem atividades registradas, comece agora!</Text>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themas.Colors.primary,
  },
  description: {
    fontSize: 14,
    color: themas.Colors.gray,
  },
  date: {
    fontSize: 12,
    color: themas.Colors.secondary,
  },
  noActivitiesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: themas.Colors.gray,
  },
});

export default AtividadesList;