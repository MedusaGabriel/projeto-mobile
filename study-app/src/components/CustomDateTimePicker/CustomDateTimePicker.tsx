import React from "react";
import { Platform, View, StyleSheet, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

  interface CustomDateTimePickerProps {
    type: "date" | "time";
    show: boolean;
    setShow: (show: boolean) => void;
    onDateChange: (date: Date) => void;
    selectedDate: Date;  // Recebe o valor da data atual
  }

  const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
    type,
    show,
    setShow,
    onDateChange,
    selectedDate, // Adiciona selectedDate como prop
  }) => {
    const isIOS = Platform.OS === "ios";

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onDateChange(selectedDate); // Atualiza a data no componente pai
    }
  };

  return (
    <>
      {show && (
        isIOS ? (
          <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={selectedDate} // Passa a data atual
                mode={type}
                display="spinner"
                onChange={handleChange}
                locale="pt-BR" // Configura o idioma para o Brasil
              />
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate} // Passa a data atual
            mode={type}
            display="default"
            onChange={handleChange}
            locale="pt-BR" // Configura o idioma para o Brasil
          />
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});

export default CustomDateTimePicker;