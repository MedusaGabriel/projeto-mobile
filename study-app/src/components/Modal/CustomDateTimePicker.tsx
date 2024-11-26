import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal } from "react-native";

interface CustomDateTimePickerProps {
    type: "date" | "time";
    show: boolean;
    setShow: (show: boolean) => void;
    onDateChange: (date: Date) => void;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({ type, show, setShow, onDateChange }) => {
    const isIOS = Platform.OS === "ios";

    const handleChange = (_event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) onDateChange(selectedDate);
    };

    return (
        <>
            {show && (
                isIOS ? (
                    <Modal transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <DateTimePicker
                                value={new Date()}
                                mode={type}
                                display="spinner"
                                onChange={handleChange}
                                locale="pt-BR" // Configurando o idioma para o padrão brasileiro
                            />
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={new Date()}
                        mode={type}
                        display="default"
                        onChange={handleChange}
                        locale="pt-BR" // Configurando o idioma para o padrão brasileiro
                    />
                )
            )}
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
});

export default CustomDateTimePicker;