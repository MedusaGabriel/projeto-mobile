import React, { useRef, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { themas } from "../../global/themes";
import { useGoal } from "../Context/authcontextmetas";
import { format } from 'date-fns';
import { LinearGradient } from "expo-linear-gradient";
import { ptBR } from 'date-fns/locale';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  dataConclusaoReal?: string | null;
  concluido: boolean;
  createdAt: string;
}

const MetasList: React.FC = () => {
  const { goalsList, handleDelete, toggleConcluido } = useGoal();
  const swipeableRefs = useRef<(Swipeable | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [goalsList]);

  const renderRightActions = (item: Meta, index: number) => (
    <View style={[styles.Button, { backgroundColor: 'red', marginRight: 20, marginLeft: -20 }]}>
      <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleDeleteGoal(item, index)}>
        <AntDesign name="delete" size={20} color={'#FFF'} />
        <Text style={styles.ButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDeleteGoal = (goal: Meta, index: number) => {
    Alert.alert(
      "Excluir Meta",
      `Tem certeza de que deseja excluir a meta "${goal.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => swipeableRefs.current[index]?.close() },
        { text: "Excluir", style: "destructive", onPress: () => handleDelete(goal.id) },
      ]
    );
  };

  const adjustDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
  };

  const renderMeta = ({ item, index }: { item: Meta; index: number }) => {
    let formattedDate = item.dataConclusao;
    if (item.concluido && item.dataConclusaoReal) {
      formattedDate = item.dataConclusaoReal;
    }

    try {
      const date = adjustDate(formattedDate);
      if (!isNaN(date.getTime())) {
        formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error);
    }

    const dateLabel = item.concluido ? "Concluído em:" : "Previsão de conclusão:";

    return (
      <View style={styles.swipeableContainer}>
        <Swipeable
          ref={(ref) => (swipeableRefs.current[index] = ref)}
          key={item.id}
          renderRightActions={() => renderRightActions(item, index)}
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
                  <Text>{dateLabel} {formattedDate}</Text>
                </View>
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    );
  };

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    // Atualiza a altura total do conteúdo
  };

  const isGradientVisible = goalsList.length > 6; // LinearGradient será exibido a partir da 8ª meta

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themas.Colors.primary} />
          <Text style={styles.loadingText}>Carregando metas...</Text>
        </View>
      ) : goalsList.length > 0 ? (
        <>
          <FlatList
            data={goalsList}
            renderItem={renderMeta}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 100 }} />}
            onContentSizeChange={handleContentSizeChange} // Atualiza a altura do conteúdo
          />
          {isGradientVisible && ( 
            <LinearGradient
              colors={["transparent", themas.Colors.bgSecondary]}
              style={styles.gradient}
            />
          )}
        </>
      ) : (
        <Text style={styles.subtitulo}>Sem metas registradas, comece agora!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  boxList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 20,
    width: "auto",
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
  descriptionCard: {
    color: themas.Colors.gray,
  },
  dateCard: {
    color: themas.Colors.secondary,
  },
  rowCardLeft: {
    paddingLeft: 10,
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
    width: '100%',
  },
  subtitulo: {
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  swipeableContainer: {
    width: "100%",
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
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

export default MetasList;