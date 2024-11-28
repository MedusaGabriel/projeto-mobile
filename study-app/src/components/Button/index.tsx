import React from "react";
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, Text, StyleProp, TextStyle, ViewStyle, StyleSheet } from 'react-native';
import { themas } from "../../global/themes";

type Props = TouchableOpacityProps & {
    text: string,
    loading?: boolean,
    buttonStyle?: StyleProp<ViewStyle>,  // Permite estilos personalizados para a view do botão
    textStyle?: StyleProp<TextStyle>,  // Permite estilos personalizados para o texto
    width?: number | string, // Pode ser número ou string (como "100%")
    height?: number, // Espera um valor numérico para a altura
    backgroundColor?: StyleProp<ViewStyle>,  // Estilo para a cor de fundo (ViewStyle)
    textColor?: string | StyleProp<TextStyle>,  // Estilo para a cor do texto (TextStyle)
};

export function Button({ text, loading, buttonStyle, textStyle, width, height, backgroundColor, textColor, ...rest }: Props) {
    return (
        <TouchableOpacity 
            {...rest} 
            style={[
                style.button, 
                buttonStyle, 
                backgroundColor, // Aplica o estilo de cor de fundo se fornecido
                width ? { width: width as any } : {}, // Ajusta a largura se fornecida (como string ou número)
                height ? { height } : {} // Ajusta a altura se fornecida
            ]}
            activeOpacity={0.6}
        >
            {loading ? (
                <ActivityIndicator color={'#FFF'} />
            ) : (
                <Text style={[style.textButton, textStyle, typeof textColor === 'string' ? { color: textColor } : {}]}>{text}</Text> // Aplica o estilo de cor de texto se fornecido
            )}
        </TouchableOpacity>
    );
}

export const style = StyleSheet.create({
    button: {
        width: 200,  // Largura padrão
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    textButton: {
        fontSize: 16,
        fontFamily: themas.Fonts.bold,
        color: '#FFF', // Cor padrão do texto
    },
});