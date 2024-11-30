import React from "react";
import { Platform, View, StyleSheet, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { themas } from "../../global/themes";

interface CustomDateTimePickerProps {
  type: "date" | "time";
  show: boolean;
  setShow: (show: boolean) => void;
  onDateChange: (date: Date) => void;
  selectedDate: Date;  // Data Selecionada
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  type,
  show,
  setShow,
  onDateChange,
  selectedDate,  // A data selecionada será passada para o DateTimePicker
}) => {

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(false); // Fecha o picker após a escolha
    if (selectedDate) {
      onDateChange(selectedDate); // Atualiza a data no componente pai
    }
  };

  return (
    <>
      {show && (
        <Modal
          transparent
          animationType="slide"
          visible={show}
          onRequestClose={() => setShow(false)} // Garante o fechamento correto no iOS
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedDate} // Passa a data selecionada (dataConclusao será usada aqui)
                mode={type === 'date' ? 'date' : 'time'} // Define o modo correto dependendo do tipo
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Ajuste para iOS: spinner para data
                onChange={handleChange}
                locale="pt-BR" // Configura o idioma para o Brasil
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background escurecido para destaque do modal
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '80%', // Ajusta a largura do DateTimePicker
    backgroundColor: themas.Colors.bgScreen, // Cor de fundo mais clara
    borderRadius: 10, // Bordas arredondadas
    padding: 20, // Espaçamento interno
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, 
    shadowRadius: 3.5,
    elevation: 5, // Sombra para Android
  }
});

export default CustomDateTimePicker;