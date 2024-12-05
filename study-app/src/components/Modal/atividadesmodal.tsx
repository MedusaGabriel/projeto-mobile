import React, { useRef, useState, useEffect } from "react";
import { Modalize } from 'react-native-modalize';
import { Input } from "../Input";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal, Button } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import CustomDateTimePicker from "../CustomDateTimePicker/CustomDateTimePicker";
import { themas } from '../../global/themes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useActivity } from "../Context/authcontextatividades";
import IconColorPickerModal from '../Modal/iconcolorpickermodal';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  materia: string;
  dataConclusao: string;
  icon: string;
  color: string;
  status: 'em andamento' | 'em pausa' | 'concluido';
  createdAt: string;
}

interface AtividadesModalProps {
  isEdit?: boolean;
  editActivity?: Activity | null;
}

export const AtividadesModal: React.FC<AtividadesModalProps> = ({ isEdit = false, editActivity = null }) => {
  const modalizeRef = useRef<Modalize>(null);
  const [titulo, setTitulo] = useState(editActivity?.titulo || '');
  const [descricao, setDescricao] = useState(editActivity?.descricao || '');
  const [dataConclusao, setDataConclusao] = useState(editActivity ? new Date(editActivity.dataConclusao) : new Date());
  const [materia, setMateria] = useState(editActivity?.materia || '');
  const [icon, setIcon] = useState(editActivity?.icon || 'home');
  const [color, setColor] = useState(editActivity?.color || '#00FF00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSave, setOnOpen } = useActivity();
  const formattedDate = format(dataConclusao, 'dd/MM/yyyy', { locale: ptBR });

  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => {
    modalizeRef.current?.close();
    resetForm();
  };

  useEffect(() => {
    setOnOpen(() => onOpen);
  }, [setOnOpen]);

  useEffect(() => {
    if (isEdit && editActivity) {
      setTitulo(editActivity.titulo);
      setDescricao(editActivity.descricao);
      setDataConclusao(new Date(editActivity.dataConclusao));
      setIcon(editActivity.icon);
      setColor(editActivity.color);
      setMateria(editActivity.materia);
    }
  }, [isEdit, editActivity]);

  const handleSaveActivity = async () => {
    if (!titulo.trim() || !descricao.trim() || !dataConclusao) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos antes de salvar.");
      return;
    }

    const adjustedDate = new Date(dataConclusao.setHours(12, 0, 0, 0));

    const generateUniqueId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000000);
      return `${timestamp}_${random}`;
    };

    const newActivity: Activity = {
      id: editActivity?.id || generateUniqueId(),
      titulo,
      descricao,
      materia,
      dataConclusao: format(adjustedDate, 'yyyy-MM-dd', { locale: ptBR }),
      icon,
      color,
      status: 'em andamento',
      createdAt: new Date().toISOString(),
    };

    await handleSave(newActivity, isEdit, editActivity?.id || newActivity.id);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
    setIcon('home');
    setColor('#00FF00');
    setMateria('');
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
          <TouchableOpacity onPress={handleSaveActivity}>
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
            onChangeText={setDescricao}
          />
          <Input
            title="Nome da Matéria:"
            labelStyle={styles.label}
            value={materia}
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
                <DateTimePickerModal
                  mode="date"
                  onConfirm={(date) => {
                    date.setHours(12, 0, 0, 0);
                    setDataConclusao(date);
                    setShowDatePicker(false);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                  isVisible={showDatePicker}
                  date={dataConclusao}
                  locale="pt-BR"
                  pickerContainerStyleIOS={{
                    backgroundColor: themas.Colors.bgScreen,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  textColor={themas.Colors.primary}
                  customCancelButtonIOS={() => null}
                />
              </View>
            )}
          </View>
          <View style={styles.iconColorPickerButtonView}>
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
    <>
      {loading && (
        <Modal transparent>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themas.Colors.primary} />
          </View>
        </Modal>
      )}
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
    </>
  );
};

export default AtividadesModal;

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