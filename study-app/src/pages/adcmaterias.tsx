import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { themas } from '../global/themes'; 

const Adcmat = () => {
    const [materia, setMateria] = useState('');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const navigation = useNavigation<NavigationProp<any>>();

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (event.type === 'set') setDate(selectedDate);
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (event.type === 'set') setTime(selectedTime);
    };

    const handleSave = () => {
        if (!materia) {
            return Alert.alert('Atenção', 'Por favor, informe a matéria.');
        }
        navigation.navigate('AppRouter');
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Matéria</Text>
            <Input
                placeholder="Nome da matéria"
                value={materia}
                placeholderTextColor={themas.Colors.secondary}
                onChangeText={setMateria}
                style={styles.input}
            />

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>
                    {date ? date.toLocaleDateString() : "Selecionar Data"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.dateButtonText}>
                    {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Selecionar Hora"}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <View style={styles.buttonContainer}>
                <Button text="Adicionar" onPress={handleSave} loading={loading} />
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Adcmat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themas.Colors.bgSecondary,
        paddingHorizontal: 20,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        color: themas.Colors.primary,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        marginBottom: 20,
        backgroundColor: themas.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    dateButton: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themas.Colors.bgScreen,
        fontFamily: themas.Fonts.regular,
        marginVertical: 10,
    },
    dateButtonText: {
        color: themas.Colors.secondary,
        fontFamily: themas.Fonts.regular,
        
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    cancelButton: {
        marginTop: 15,
        padding: 10,
    },
    cancelButtonText: {
        fontSize: 16,
        color: themas.Colors.secondary,
    },
});
