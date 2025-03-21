import React, { useRef, useState, useEffect } from "react";
import { Modalize } from 'react-native-modalize';
import { Input } from "../Input";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { themas } from '../../global/themes';
import { format } from 'date-fns'; 
import { ptBR } from 'date-fns/locale';
import { useGoal } from "../Context/authcontextmetas";

interface Goal {
  createdAt: string | number | Date;
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  dataConclusaoReal?: string | null;
  concluido: boolean; 
}

interface MetasModalProps {
  isEdit?: boolean;
  editGoal?: Goal | null;
  onClose: () => void;
}

export const MetasModal: React.FC<MetasModalProps> = ({ isEdit = false, editGoal = null, onClose }) => {
  const modalizeRef = useRef<Modalize>(null);
  const [titulo, setTitulo] = useState(editGoal?.titulo || '');
  const [descricao, setDescricao] = useState(editGoal?.descricao || '');
  const [dataConclusao, setDataConclusao] = useState(editGoal ? new Date(editGoal.dataConclusao) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { handleSave, setOnOpen } = useGoal();
  const formattedDate = format(dataConclusao, 'dd/MM/yyyy', { locale: ptBR });

  const onOpen = () => modalizeRef.current?.open();
  const handleClose = () => {
    modalizeRef.current?.close();
    resetForm();
    onClose();
  };

  useEffect(() => {
    setOnOpen(() => onOpen);
  }, [setOnOpen]);

  useEffect(() => {
    if (isEdit && editGoal) {
      setTitulo(editGoal.titulo);
      setDescricao(editGoal.descricao);
      setDataConclusao(new Date(editGoal.dataConclusao));
    }
  }, [isEdit, editGoal]);

  const handleSaveGoal = async () => {
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
    
    const newGoal = {
      id: editGoal?.id || generateUniqueId(),
      titulo,
      descricao,
      dataConclusao: format(adjustedDate, 'yyyy-MM-dd', { locale: ptBR }),
      dataConclusaoReal: editGoal?.dataConclusaoReal || null,
      concluido: editGoal?.concluido || false,
      createdAt: editGoal?.createdAt ? new Date(editGoal.createdAt).toISOString() : new Date().toISOString(),
    };
  
    await handleSave(newGoal, isEdit, editGoal?.id || newGoal.id);
    handleClose();
    resetForm();
  };
  
  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
  };

  const _container = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="close" size={30} color={themas.Colors.blueLigth} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEdit ? "Edite sua Meta" : "Crie uma nova Meta"}</Text>
          <TouchableOpacity onPress={handleSaveGoal}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
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
  );
};

export default MetasModal;

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
});