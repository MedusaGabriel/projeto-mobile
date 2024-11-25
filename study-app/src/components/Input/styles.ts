import { StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    boxInput: {
        width: '100%',
        height: 50,
        borderWidth: 0, // Remover borda
        borderRadius: 10, // Menos arredondado
        backgroundColor: themas.Colors.bgScreen, // Manter a cor bgScreen
        marginTop: 23,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    
    input: {
        color: themas.Colors.primary,
        height: '100%',
        paddingVertical: 10,
        fontSize: 16,  // Tamanho de fonte maior
        borderRadius: 10,
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
