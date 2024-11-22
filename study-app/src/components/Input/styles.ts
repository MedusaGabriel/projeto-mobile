import { StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    boxInput: {
        width: '100%',
        height: 0,
        borderWidth: 0, // Remover borda
        borderRadius: 10, // Menos arredondado
        backgroundColor: themas.Colors.bgScreen, // Manter a cor bgScreen
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    
    input: {
        color: themas.Colors.primary,
        height: '100%',
        width: '100%',
        fontSize: 16,  // Tamanho de fonte maior
        borderRadius: 40,
        fontFamily: themas.Fonts.regular,
    },
    titleInput: {
        marginLeft: 5,
        color: themas.Colors.blueLigth,
        marginTop: 20,
    },
    Button: {
        width: '10%',
    },
    Icon: {
        width: '100%',
    },
});
