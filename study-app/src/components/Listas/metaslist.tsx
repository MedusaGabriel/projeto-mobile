import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { themas } from "../../global/themes";
import { useGoal } from "../Modal/metasmodal";
import { db } from "../../services/firebaseConfig";
import { format } from 'date-fns';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  concluido: boolean;
}

const MetasList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  const swipeableRefs = useRef<(Swipeable | null)[]>([]); // Ref para os Swipeables
  const { goalsList, setGoalsList, setTitulo, setDescricao, setDataConclusao, setIsEdit, onOpen, setEditGoalId } = useGoal();

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
              concluido: data.concluido || false,
            });
          });
          setGoalsList(metasList); // Atualiza o estado com as metas obtidas do Firestore
        } catch (error) {
          console.error("Erro ao buscar metas:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMetas();
    }
  }, [userId, setGoalsList]);

  const toggleConcluido = async (id: string) => {
    const metaRef = doc(db, "users", userId as string, "metas", id);
    try {
      await updateDoc(metaRef, {
        concluido: !goalsList.find(meta => meta.id === id)?.concluido,
      });
      setGoalsList((prevMetas) =>
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
      setGoalsList((prevMetas) => prevMetas.filter((item) => item.id !== meta.id));
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
    }
  };
  
  const handleEdit = (meta: Meta, index: number) => {
    // Fecha o Swipeable do item atual
    swipeableRefs.current[index]?.close();
  
    // Configura os valores no modal
    setTitulo(meta.titulo);
    setDescricao(meta.descricao);
  
    // Converte a string de data para um objeto Date usando o construtor Date
    const [day, month, year] = meta.dataConclusao.split('/');
    const dataConclusao = new Date(`${year}-${month}-${day}`);
  
    if (!isNaN(dataConclusao.getTime())) {
      setDataConclusao(dataConclusao);
    } else {
      console.error("Data de conclusão inválida:", meta.dataConclusao);
      setDataConclusao(new Date()); // Fallback para a data atual
    }
  
    setIsEdit(true);
    setEditGoalId(meta.id);
    onOpen();
  };

  const renderRightActions = () => (
    <View style={[styles.Button, { backgroundColor: 'red' }]}>
      <AntDesign name="delete" size={20} color={'#FFF'} />
      <Text style={styles.ButtonText}>Delete</Text>
    </View>
  );
  
  const renderLeftActions = (meta: Meta, index: number) => (
    <View style={[styles.Button, { backgroundColor: themas.Colors.blueLigth }]}>
      <AntDesign name="edit" size={20} color={'#FFF'} />
      <TouchableOpacity onPress={() => handleEdit(meta, index)}>
        <Text style={styles.ButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMeta = ({ item, index }: { item: Meta; index: number }) => {
    let formattedDate = item.dataConclusao;
    try {
      const date = new Date(item.dataConclusao);
      if (!isNaN(date.getTime())) {
        formattedDate = format(date, 'dd/MM/yyyy'); // Formato de data desejado
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error);
    }
  
    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[index] = ref)}
        key={item.id}
        renderRightActions={renderRightActions}
        renderLeftActions={() => renderLeftActions(item, index)}  // Passando o índice aqui
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            handleEdit(item, index);  // Passando o índice para o handleEdit
          } else {
            handleDelete(item);
          }
        }}
      >
        <View style={[styles.card, item.concluido && { backgroundColor: themas.Colors.green }]}>
          <View style={styles.rowCard}>
            <View style={styles.rowCardLeft}>
              <TouchableOpacity
                style={[styles.circle, item.concluido && { backgroundColor: themas.Colors.greenlight }]}
                onPress={() => toggleConcluido(item.id)}
              >
                {item.concluido && <AntDesign name="check" size={16} color="#FFF" />}
              </TouchableOpacity>
              <View>
                <Text style={styles.titleCard}>{item.titulo}</Text>
                <Text>{item.descricao}</Text>
                <Text>Data de Conclusão: {formattedDate}</Text>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={themas.Colors.primary} />
        ) : goalsList.length > 0 ? (
          <FlatList
            data={goalsList}
            renderItem={renderMeta}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatList}
          />
        ) : (
          <Text style={styles.subtitulo}>Sem metas registradas, comece agora!</Text>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
  },
  header: {
    width: '100%',
    height: Dimensions.get('window').height / 6,
    backgroundColor: themas.Colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    color: '#FFF',
    marginTop: 20,
  },
  boxInput: {
    width: '80%',
  },
  boxList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
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
  descriptionCard: {
    color: themas.Colors.gray,
  },
  rowCardLeft: {
    width: '80%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: themas.Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  Button: {
    backgroundColor: 'red',  // Cor do botão
    justifyContent: 'center',
    alignItems: 'center',
    height: '89%',  // Garante que o botão ocupe toda a altura do item do Swipeable
    width: 70,  // Ajuste o tamanho se necessário
    borderRadius: 10,
    padding: 10, // Adiciona algum espaçamento ao redor do ícone
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatList: {
    marginTop: 10,
    width: '100%',
  },
  subtitulo: {
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MetasList