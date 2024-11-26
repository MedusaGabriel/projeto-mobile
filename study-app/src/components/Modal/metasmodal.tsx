import React, { createContext, useContext, useRef, useState, ReactNode } from "react";
import { Modalize } from 'react-native-modalize';
import { Input } from "../Input";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import CustomDateTimePicker from "../CustomDateTimePicker/CustomDateTimePicker";
import { themas } from '../../global/themes';
import { format } from 'date-fns'; 
import { ptBR } from 'date-fns/locale';
import { serverTimestamp, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from "../../services/firebaseConfig";

const FieldValue = { serverTimestamp };

interface GoalContextProps {
  onOpen: () => void;
  goalsList: any[];
  setGoalsList: React.Dispatch<React.SetStateAction<Goal[]>>,
}

export const GoalContext = createContext<GoalContextProps>({} as GoalContextProps);

interface Goal {
  id: number;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  concluido: boolean; 
}

export const MetasModal = ({ children }: { children: ReactNode }) => {
  const modalizeRef = useRef<Modalize>(null);
  const [titulo, setTitulo] = useState(''); // Renomeado de title para titulo
  const [descricao, setDescricao] = useState(''); // Renomeado de description para descricao
  const [dataConclusao, setDataConclusao] = useState(new Date()); // Renomeado de expectedDate para dataConclusao
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => {
    modalizeRef.current?.close();
    resetForm();
  };

  // Função para editar a tarefa
  const handleEdit = (goal: any) => {
    setTitulo(goal.titulo);
    setDescricao(goal.descricao);
    setDataConclusao(new Date(goal.dataConclusao)); 
    onOpen();
  };

  // Função para excluir a tarefa
  const handleDelete = async (goalId: string) => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Referência à coleção "users" -> UID do usuário -> coleção "metas" -> meta específica
      const goalDocRef = doc(db, "users", user.uid, "metas", goalId);

      // Remove a meta do Firestore
      await deleteDoc(goalDocRef);

      // Atualiza a lista local de metas, removendo a meta deletada
      setGoalsList(goalsList.filter(goal => goal.id.toString() !== goalId));

      Alert.alert("Sucesso", "Meta excluída com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao excluir a meta. Tente novamente.");
      console.error("Erro ao excluir meta no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar a meta no Firestore
  const handleSave = async () => {
    if (!titulo.trim() || !descricao.trim() || !dataConclusao) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos antes de salvar.");
      return;
    }
  
    const newGoal = {
      titulo,
      descricao,
      dataConclusao: format(dataConclusao, 'dd/MM/yyyy', { locale: ptBR }),
      concluido: false,
    };
  
    try {
      setLoading(true);
      const user = auth.currentUser;
  
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      onClose();
      resetForm();

    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a meta. Tente novamente.");
      console.error("Erro ao salvar meta no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
  };

  const formattedDate = format(dataConclusao, 'dd/MM/yyyy', { locale: ptBR });  // Formata a data para o padrão dia/mês/ano

  const _container = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={30} color={themas.Colors.blueLigth} />
          </TouchableOpacity>
          <Text style={styles.title}>Crie uma nova Meta</Text>
          <TouchableOpacity onPress={handleSave}>
            <AntDesign name="check" size={30} color={themas.Colors.blueLigth} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Input
            title="Título da Meta:"
            labelStyle={styles.label}
            value={titulo} // Usando o nome traduzido
            onChangeText={setTitulo} // Usando o nome traduzido
          />
          <View style={styles.inputContainer}>
            <Input
              title="Descrição:"
              numberOfLines={1}
              textAlignVertical="top"
              labelStyle={styles.label}
              value={descricao} // Usando o nome traduzido
              maxLength={30} // Define o limite máximo de caracteres
              onChangeText={setDescricao} // Usando o nome traduzido
            />
            <Text style={styles.charCounter}>{30 - descricao.length} caracteres restantes</Text>
          </View>
          <View style={styles.dateContainer}>
            <View style={styles.dateLabelContainer}>
              <Text style={styles.labeldate}>Data prevista para conclusão:</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInputContainer}
            >
              <Input
              style={styles.dateInputContainer}
                onPress={() => setShowDatePicker(true)}
                boxStyle={{
                  marginTop: -4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
                customPaddingLeft={0}
                inputStyle={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  width: '100%',
                }}
                editable={false}
                value={formattedDate} // Exibe a data formatada
              />
            </TouchableOpacity>

            {/* Date Picker */}
            {showDatePicker && (
              <View style={styles.datePickerWrapper}>
                <CustomDateTimePicker
                  type="date"
                  onDateChange={setDataConclusao}
                  show={showDatePicker}
                  setShow={setShowDatePicker}
                  selectedDate={dataConclusao}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <GoalContext.Provider value={{ onOpen, goalsList, setGoalsList }}>
      {loading && (
        <Modal
          transparent
          animationType="fade"
          visible={loading}
          statusBarTranslucent
        >
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={themas.Colors.primary} />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          </View>
        </Modal>
      )}
      {children}
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={{
          borderTopLeftRadius: 30,  // Arredondamento superior esquerdo
          borderTopRightRadius: 30, // Arredondamento superior direito
          backgroundColor: themas.Colors.bgSecondary,
          zIndex: 1
        }}
        >
        {_container()}
      </Modalize>
    </GoalContext.Provider>
  );
};

export const useGoal = () => useContext(GoalContext);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: themas.Colors.bgSecondary,
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    overflow: 'hidden',    
  },
  header: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: themas.Fonts.bold,
    color: themas.Colors.primary,
  },
  content: {
    width: '100%',
    paddingHorizontal: 30,
  },
  label: {
    fontFamily: themas.Fonts.medium,
    color: themas.Colors.secondary,

  },
  inputContainer: {
    width: '100%',
    alignItems: 'flex-start', 
    alignSelf: 'flex-end'
  },
  dateContainer: { //CONTAINNER GERAL COM TUDO
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row', // Alinha os itens horizontalmente
    alignItems: 'center', // Centraliza verticalmente os itens
    justifyContent: 'space-between', // Ajusta os espaços entre os itens
    borderColor: 'white',
  },
  dateLabelContainer: { // RESPONSAVEL PELA BOX DO TEXTO
    width: '50%', // Atribui 50% de largura para o texto
  },
  labeldate: { //TEXTO
    fontFamily: themas.Fonts.medium,
    color: themas.Colors.secondary,
  },
  dateInputContainer: {
    width: '50%',
  },
  datePickerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,  // Adicione esta linha para garantir que o conteúdo ocupe toda a altura disponível
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
    width: '100%',  // Garante que o conteúdo ocupe toda a largura disponível
    zIndex: 10,  // Certifique-se de que o conteúdo fique acima de outros elementos (opcional)
  },
  charCounter: {
    marginTop: 5,
    fontSize: 12,
    color: themas.Colors.secondary,
    fontFamily: themas.Fonts.medium,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    position: 'absolute',  // Para ocupar a tela inteira
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Cor de fundo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Certifica que o loading ficará acima de tudo
  },
  loadingBox: {
    width: 150,  // Largura do box (ajuste conforme necessário)
    height: 150, // Altura do box (ajuste conforme necessário)
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Cor de fundo escura para destaque
    borderRadius: 15, // Cantos arredondados
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra para um efeito 3D (se necessário)
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontFamily: themas.Fonts.medium,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MetasModal;