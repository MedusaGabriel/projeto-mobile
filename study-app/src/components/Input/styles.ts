import { StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    boxInput: {
        width: '100%',
        height: 70, // Aumentar a altura do boxInput
        borderWidth: 0, // Remover borda
        borderRadius: 10, // Menos arredondado
        backgroundColor: themas.Colors.bgScreen, // Manter a cor bgScreen
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    
    input: {
        color: themas.Colors.primary, // Cor do texto (branca, conforme o tema)
        height: '100%', // Ajustar para ocupar toda a altura do boxInput
        width: '100%',
        fontFamily: 'Arial',  // Altere para a fonte desejada
        fontSize: 16,  // Tamanho de fonte maior
        borderRadius: 10, // Ajustar o borderRadius para combinar com o boxInput
        paddingVertical: 15, // Adicionar padding vertical para aumentar a área clicável
    },
    titleInput: {
        marginLeft: 5,
        color: themas.Colors.gray,
        marginTop: 20,
    },
    Button: {
        width: '10%',
    },
    Icon: {
        width: '100%',
    },
});