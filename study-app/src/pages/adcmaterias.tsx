import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        if (event.type === 'set') {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (event.type === 'set') {
            setTime(selectedTime);
        }
    };

    async function getMateria() {
        try {
            setLoading(true);
            if (!materia) {
                setLoading(false);
                return Alert.alert('Matérias não informadas!!');
            }
            navigation.navigate('AppRouter');
        } catch (error) {
            console.log(error);
        }
    }

    // Função para cancelar e voltar para a tela anterior
    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tela Matéria</Text>
            <Input
                value={materia}
                onChangeText={setMateria}
                IconRigth={() => <AntDesign size={24} color="black" />}
                iconRightName="curso"
                onIconRigthPress={() => console.log('MATERIA')}
            />

            {/* Botão para selecionar a data */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>
                    {date ? date.toLocaleDateString() : "Selecionar Data"}
                </Text>
            </TouchableOpacity>

            {/* Botão para selecionar a hora */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.dateButtonText}>
                    {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Selecionar Hora"}
                </Text>
            </TouchableOpacity>

            {/* Seletor de data */}
            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {/* Seletor de hora */}
            {showTimePicker && (
                <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <View style={styles.boxBottom}>
                <Button text="Próximo" loading={loading} onPress={() => getMateria()} />
                <Button text="Cancelar" onPress={handleCancel} />
            </View>
        </View>
    );
};

export default Adcmat;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    boxBottom: {
        height: Dimensions.get('window').height / 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    dateButton: {
        height: 40,
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Aumentando o espaço entre os botões
        marginTop: 20, // Aumentando o espaço entre o campo de texto e os botões
        backgroundColor: '#FFF',
        width: '80%',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
});
