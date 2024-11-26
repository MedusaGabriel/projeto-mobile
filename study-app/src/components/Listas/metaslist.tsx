import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth"; // Para obter o usuário autenticado
import { themas } from "../../global/themes";
import { useGoal } from '../Modal/metasmodal'; // Importando o contexto

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
}

const MetasList: React.FC = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  const { onOpen } = useGoal(); // Obtendo a função para abrir o modal de criação

  const swipeableRefs = useRef<(Swipeable | null)[]>([]); // Ref para os Swipeables

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
      const fetchMetas = async () => {
        try {
          const metasRef = collection(db, "users", userId, "metas");
          const querySnapshot = await getDocs(metasRef);
          const metasList: Meta[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            metasList.push({
              id: doc.id,
              titulo: data.titulo,
              descricao: data.descricao,
              dataConclusao: data.dataConclusao,
            });
          });
          setMetas(metasList);
        } catch (error) {
          console.error("Erro ao buscar metas:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMetas();
    }
  }, [userId]);

  const handleDelete = async (meta: Meta) => {
    try {
      const metaDocRef = doc(db, "users", userId as string, "metas", meta.id);
      await deleteDoc(metaDocRef);
      setMetas((prevMetas) => prevMetas.filter((item) => item.id !== meta.id));
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
    }
  };

  const renderRightActions = () => (
    <View style={{ backgroundColor: themas.Colors.red, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
      <AntDesign name="delete" size={20} color="#FFF" />
    </View>
  );

  const renderLeftActions = () => (
    <View style={{ backgroundColor: themas.Colors.blueLigth, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
      <AntDesign name="edit" size={20} color="#FFF" />
    </View>
  );

  const renderMeta = ({ item, index }: { item: Meta; index: number }) => (
    <Swipeable
      ref={(ref) => swipeableRefs.current[index] = ref}
      key={item.id}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          // Handle Edit (e.g., open modal)
        } else {
          handleDelete(item);
        }
      }}
    >
      <View style={styles.metaItem}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text>{item.descricao}</Text>
        <Text>Data de Conclusão: {item.dataConclusao}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
    {loading ? (
      <ActivityIndicator size="large" color={themas.Colors.primary} />
    ) : metas.length > 0 ? (
      <FlatList
        data={metas}
        renderItem={renderMeta}
        keyExtractor={(item) => item.id}
      />
      ) : (
        <Text style={styles.subtitulo}>Sem metas registradas, registre a sua!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  metaItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitulo: {
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.gray,
    fontSize: 16,
  },
  addButton: {
    fontSize: 18,
    color: themas.Colors.blueLigth,
    textAlign: 'center',
    marginBottom: 10,
  }
});

export default MetasList;