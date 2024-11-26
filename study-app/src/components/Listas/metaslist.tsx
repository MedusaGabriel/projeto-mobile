import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { themas } from "../../global/themes";
import { useGoal } from "../Modal/metasmodal";

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  concluido: boolean;
}

const MetasList: React.FC = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  const swipeableRefs = useRef<(Swipeable | null)[]>([]); // Ref para os Swipeables
  const { goalsList } = useGoal();

  useEffect(() => {
    // Sincronizar metas do contexto
    setMetas(goalsList.map((meta) => ({ ...meta, concluido: false })));
  }, [goalsList]);

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
              concluido: false, // Inicializando como não concluído
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

  const toggleConcluido = async (id: string) => {
    const metaRef = doc(db, "users", userId as string, "metas", id);
    try {
      // Atualiza o campo 'concluido' no Firestore
      await updateDoc(metaRef, {
        concluido: !metas.find(meta => meta.id === id)?.concluido,
      });
  
      // Atualiza o estado local
      setMetas((prevMetas) =>
        prevMetas.map((meta) =>
          meta.id === id ? { ...meta, concluido: !meta.concluido } : meta
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
    }
  };

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
    <View
      style={{
        backgroundColor: themas.Colors.red,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <AntDesign name="delete" size={20} color="#FFF" />
    </View>
  );

  const renderLeftActions = () => (
    <View
      style={{
        backgroundColor: themas.Colors.blueLigth,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <AntDesign name="edit" size={20} color="#FFF" />
    </View>
  );

  const renderMeta = ({ item, index }: { item: Meta; index: number }) => (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[index] = ref)}
      key={item.id}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={(direction) => {
        if (direction === "left") {
          // Handle Edit (abrir modal)
        } else {
          handleDelete(item);
        }
      }}
    >
      <View
        style={[
          styles.metaItem,
          item.concluido && { backgroundColor: themas.Colors.green },
        ]}
      >
        <View style={styles.metaRow}>
          <TouchableOpacity
            style={[
              styles.circle,
              item.concluido && { backgroundColor: themas.Colors.blueLigth },
            ]}
            onPress={() => toggleConcluido(item.id)}
          >
            {item.concluido && (
              <AntDesign name="check" size={16} color="#FFF" />
            )}
          </TouchableOpacity>
          <View>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text>{item.descricao}</Text>
            <Text>Data de Conclusão: {item.dataConclusao}</Text>
          </View>
        </View>
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
        <Text style={styles.subtitulo}>
          Sem metas registradas, comece agora!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    width: "100%",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  metaItem: {
    backgroundColor: themas.Colors.secondary,
    borderColor: "white",
    borderWidth: 1,
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
    textAlign: "center",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: themas.Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

export default MetasList;