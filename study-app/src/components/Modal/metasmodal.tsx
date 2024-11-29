import React, { createContext, useContext, useRef, useState, ReactNode } from "react";
import { Modalize } from 'react-native-modalize';
import { Input } from "../Input";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import CustomDateTimePicker from "../CustomDateTimePicker/CustomDateTimePicker";
import { themas } from '../../global/themes';
import { format } from 'date-fns'; 
import { ptBR } from 'date-fns/locale';
import { serverTimestamp, addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from "../../services/firebaseConfig";

const FieldValue = { serverTimestamp };

interface GoalContextProps {
  onOpen: () => void;
  goalsList: any[];
  setGoalsList: React.Dispatch<React.SetStateAction<Goal[]>>,
  setTitulo: React.Dispatch<React.SetStateAction<string>>,
  setDescricao: React.Dispatch<React.SetStateAction<string>>,
  setDataConclusao: React.Dispatch<React.SetStateAction<Date>>,
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setEditGoalId: React.Dispatch<React.SetStateAction<string | null>>,
  handleEdit: (goal: Goal) => void,
}

export const GoalContext = createContext<GoalContextProps>({} as GoalContextProps);

interface Goal {
  createdAt: string | number | Date;
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  concluido: boolean; 
}

export const MetasModal = ({ children }: { children: ReactNode }) => {
  const modalizeRef = useRef<Modalize>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataConclusao, setDataConclusao] = useState(new Date());
  const [isEdit, setIsEdit] = useState(false);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const formattedDate = format(dataConclusao, 'dd/MM/yyyy', { locale: ptBR });

  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => {
    modalizeRef.current?.close();
    resetForm();
    fetchMetas();
  };

  const fetchMetas = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const metasRef = collection(db, "users", user.uid, "metas");
      const querySnapshot = await getDocs(metasRef);
      let metasList: Goal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        metasList.push({
          id: doc.id,
          titulo: data.titulo,
          descricao: data.descricao,
          dataConclusao: data.dataConclusao,
          concluido: data.concluido || false,
          createdAt: data.createdAt || new Date().toISOString(), // Adiciona a data de criação
        });
      });
      metasList = metasList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
      setGoalsList(metasList);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    }
  };

  const handleSave = async () => {
  if (!titulo.trim() || !descricao.trim() || !dataConclusao) {
    Alert.alert("Atenção", "Por favor, preencha todos os campos antes de salvar.");
    return;
  }

  const adjustedDate = new Date(dataConclusao.setHours(12, 0, 0, 0));

  if (adjustedDate !== dataConclusao) {
    setDataConclusao(adjustedDate);
  }

  const newGoal = {
    titulo,
    descricao,
    dataConclusao: format(adjustedDate, 'dd/MM/yyyy', { locale: ptBR }),
    concluido: false,
    createdAt: new Date().toISOString(),
  };

  try {
    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const metasRef = collection(db, "users", user.uid, "metas");

    if (isEdit && editGoalId) {
      const goalDocRef = doc(db, "users", user.uid, "metas", editGoalId);
      await updateDoc(goalDocRef, newGoal);
      Alert.alert("Sucesso!", "Meta atualizada com sucesso!");
    } else {
      const goalDocRef = await addDoc(metasRef, newGoal);
      const newGoalWithId = { id: goalDocRef.id, ...newGoal };
      setGoalsList((prevGoals) => {
        const updatedGoals = [newGoalWithId, ...prevGoals];

        // Separando as metas concluídas das não concluídas
        const nonConcludedGoals = updatedGoals.filter(goal => !goal.concluido);
        const concludedGoals = updatedGoals.filter(goal => goal.concluido);

        // Ordenando as metas não concluídas por data de criação
        nonConcludedGoals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Concatenando as metas não concluídas com as concluídas no final
        return [...nonConcludedGoals, ...concludedGoals];
      });
      Alert.alert("Sucesso!", "Meta salva com sucesso!");
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
  
  const handleEdit = (goal: Goal) => {
    setTitulo(goal.titulo);
    setDescricao(goal.descricao);
  
    // Se a data for string no formato 'dd/MM/yyyy', convertemos para um objeto Date
    let date: Date;
  
    if (goal.dataConclusao.includes('/')) {
      const [day, month, year] = goal.dataConclusao.split('/');
      date = new Date(`${year}-${month}-${day}T12:00:00`); // ISO format com hora ajustada para meio-dia
    } else {
      date = new Date(goal.dataConclusao);
      date.setHours(12, 0, 0, 0); // Ajuste para meio-dia (12:00) para evitar problemas de fuso horário
    }

    // Atualiza o estado com a nova data
    setDataConclusao(date);
  
    setIsEdit(true);
    setEditGoalId(goal.id);
    onOpen();
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
    setIsEdit(false);
    setEditGoalId(null);
  };

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
          <Text style={styles.title}>{isEdit ? "Edite sua Meta" : "Crie uma nova Meta"}</Text>
          <TouchableOpacity onPress={handleSave}>
            <AntDesign name="check" size={30} color={themas.Colors.blueLigth} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Input
            title="Título da Meta:"
            labelStyle={styles.label}
            value={titulo}
            onChangeText={setTitulo}
          />
          <View style={styles.inputContainer}>
            <Input
              title="Descrição:"
              labelStyle={styles.label}
              value={descricao}
              maxLength={30}
              onChangeText={setDescricao}
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
                value={formattedDate}
              />
            </TouchableOpacity>
  
            {showDatePicker && (
              <View style={styles.datePickerWrapper}>
                <CustomDateTimePicker
                  type="date"
                  onDateChange={(date) => {
                    // Ajustar a data para meio-dia (12:00) para evitar problemas de fuso horário
                    date.setHours(12, 0, 0, 0);
                    setDataConclusao(date);
                  }}
                  show={showDatePicker}
                  setShow={setShowDatePicker}
                  selectedDate={dataConclusao}  // Passando dataConclusao corretamente
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <GoalContext.Provider value={{ onOpen, goalsList, setGoalsList, setTitulo, setDescricao, setDataConclusao, setIsEdit, setEditGoalId, handleEdit }}>
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
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: themas.Colors.bgSecondary,
          zIndex: 1
        }}
        onOverlayPress={resetForm}
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
  dateContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'white',
  },
  dateLabelContainer: {
    width: '50%',
  },
  labeldate: {
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
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  charCounter: {
    marginTop: 5,
    fontSize: 12,
    color: themas.Colors.secondary,
    fontFamily: themas.Fonts.medium,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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