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
import IconColorPickerModal from '../Modal/iconcolorpickermodal';

const FieldValue = { serverTimestamp };

interface ActivityContextProps {
  onOpen: () => void;
  activitiesList: any[];
  setActivitiesList: React.Dispatch<React.SetStateAction<Activity[]>>;
  setTitulo: React.Dispatch<React.SetStateAction<string>>;
  setDescricao: React.Dispatch<React.SetStateAction<string>>;
  setDataConclusao: React.Dispatch<React.SetStateAction<Date>>;
  setIcon: React.Dispatch<React.SetStateAction<string>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setEditActivityId: React.Dispatch<React.SetStateAction<string | null>>;
  handleEdit: (activity: Activity) => void;
}

export const ActivityContext = createContext<ActivityContextProps>({} as ActivityContextProps);

interface Activity {
  createdAt: string | number | Date;
  id: string;
  titulo: string;
  descricao: string;
  materia : string;
  dataConclusao: string;
  icon: string;
  color: string;
  concluido: boolean;
}

export const AtividadesModal = ({ children }: { children: ReactNode }) => {
  const modalizeRef = useRef<Modalize>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataConclusao, setDataConclusao] = useState(new Date());
  const [materia, setMateria] = useState('');
  const [icon, setIcon] = useState('home'); // Default icon set to 'home'
  const [color, setColor] = useState('#00FF00'); // Default color set to green
  const [isEdit, setIsEdit] = useState(false);
  const [editActivityId, setEditActivityId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const formattedDate = format(dataConclusao, 'dd/MM/yyyy', { locale: ptBR });

  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => {
    modalizeRef.current?.close();
    resetForm();
    fetchActivities();
  };

  const fetchActivities = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const activitiesRef = collection(db, "users", user.uid, "activities");
      const querySnapshot = await getDocs(activitiesRef);
      let activitiesList: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activitiesList.push({
          id: doc.id,
          titulo: data.titulo,
          descricao: data.descricao,
          materia: data.materia,
          dataConclusao: data.dataConclusao,
          icon: data.icon || '',
          color: data.color || '#FFFFFF',
          concluido: data.concluido || false,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      activitiesList = activitiesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivitiesList(activitiesList);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
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

    const newActivity = {
      titulo,
      descricao,
      materia,
      dataConclusao: format(adjustedDate, 'dd/MM/yyyy', { locale: ptBR }),
      icon,
      color,
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

      const activitiesRef = collection(db, "users", user.uid, "activities");

      if (isEdit && editActivityId) {
        const activityDocRef = doc(db, "users", user.uid, "activities", editActivityId);
        await updateDoc(activityDocRef, newActivity);
        Alert.alert("Sucesso!", "Atividade atualizada com sucesso!");
      } else {
        const activityDocRef = await addDoc(activitiesRef, newActivity);
        const newActivityWithId = { id: activityDocRef.id, ...newActivity };
        setActivitiesList((prevActivities) => [newActivityWithId, ...prevActivities]);
        Alert.alert("Sucesso!", "Atividade salva com sucesso!");
      }

      onClose();
      resetForm();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a atividade. Tente novamente.");
      console.error("Erro ao salvar atividade no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setTitulo(activity.titulo);
    setDescricao(activity.descricao);
    setIcon(activity.icon);
    setColor(activity.color);

    let date: Date;
    if (activity.dataConclusao.includes('/')) {
      const [day, month, year] = activity.dataConclusao.split('/');
      date = new Date(`${year}-${month}-${day}T12:00:00`);
    } else {
      date = new Date(activity.dataConclusao);
      date.setHours(12, 0, 0, 0);
    }

    setDataConclusao(date);
    setIsEdit(true);
    setEditActivityId(activity.id);
    onOpen();
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
    setIcon('home'); // Reset to default icon
    setColor('#00FF00'); // Reset to default color
    setIsEdit(false);
    setEditActivityId(null);
  };

  const handleSelectIcon = (selectedIcon: string) => {
    setIcon(selectedIcon);
    setShowIconPicker(false);
  };

  const handleSelectColor = (selectedColor: string) => {
    setColor(selectedColor);
    setShowColorPicker(false);
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
          <Text style={styles.title}>{isEdit ? "Edite sua Atividade" : "Crie uma Atividade"}</Text>
          <TouchableOpacity onPress={handleSave}>
            <AntDesign name="check" size={30} color={themas.Colors.blueLigth} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Input
            title="Título da Atividade:"
            labelStyle={styles.label}
            value={titulo}
            onChangeText={setTitulo}
          />
          <Input
            title="Descrição:"
            labelStyle={styles.label}
            value={descricao}
            multiline
            numberOfLines={5}
            onChangeText={setDescricao}
          />
        <Input
            title="Nome da Matéria:"
            labelStyle={styles.label}
            value={materia}
            multiline
            numberOfLines={5}
            onChangeText={setMateria}
          />
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
          <View style={styles.iconColorPickerButtonView} >
          <TouchableOpacity onPress={() => setShowIconPicker(true)} style={styles.iconColorPickerButton}>
            <MaterialIcons name={icon as any} size={30} color={color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowColorPicker(true)} style={styles.iconColorPickerButton}>
            <View style={[styles.colorCircle, { backgroundColor: color }]} />
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <ActivityContext.Provider value={{ onOpen, activitiesList, setActivitiesList, setTitulo, setDescricao, setDataConclusao, setIcon, setColor, setIsEdit, setEditActivityId, handleEdit }}>
      {loading && (
        <Modal transparent>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themas.Colors.primary} />
          </View>
        </Modal>
      )}
      {children}
      <Modalize ref={modalizeRef} adjustToContentHeight modalStyle={styles.modal}>
        {_container()}
      </Modalize>
      <IconColorPickerModal
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={handleSelectIcon}
        onSelectColor={() => {}}
        type="icon"
      />
      <IconColorPickerModal
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectIcon={() => {}}
        onSelectColor={handleSelectColor}
        type="color"
      />
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);

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
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: themas.Fonts.bold,
        color: themas.Colors.primary,
    },
    content: {
      width: '100%',
      paddingHorizontal: 10,
    },
    label: {
      fontFamily: themas.Fonts.medium,
      color: themas.Colors.secondary,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'flex-start', 
        alignSelf: 'flex-end',
    },
    dateContainer: {
        marginTop: 25,
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
      dateText: {
        fontFamily: themas.Fonts.medium,
        color: themas.Colors.secondary,
        fontSize: 16,
      },
      datePicker: {
        padding: 10,
        backgroundColor: themas.Colors.bgScreen,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
      },
      charCounter: {
        marginTop: 5,
        fontSize: 12,
        color: themas.Colors.secondary,
        fontFamily: themas.Fonts.medium,
        alignSelf: 'flex-end',
      },
    iconColorPickerButtonView: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconColorPickerButton: {
        width: '48%',
        height: 50,
        backgroundColor: themas.Colors.bgScreen,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        flexDirection: 'row',
    },
    colorCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 10,
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
    modal: {
      backgroundColor: themas.Colors.bgSecondary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
    },
  });