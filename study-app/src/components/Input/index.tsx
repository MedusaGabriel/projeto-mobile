import React, { forwardRef, LegacyRef } from "react";
import { TextInput, View, TextInputProps, Text, TouchableOpacity, StyleProp, TextStyle, StyleSheet, ViewStyle } from "react-native";
import { MaterialIcons, FontAwesome, Octicons } from "@expo/vector-icons";
import { themas } from "../../global/themes";

type IconComponent = 
    | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
    | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
    | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent;
    IconRight?: IconComponent;  // Corrigido para "IconRight"
    iconLeftName?: string;
    iconRightName?: string;
    title?: string;
    onIconLeftPress?: () => void;
    onIconRightPress?: () => void;  // Corrigido para "onIconRightPress"
    height?: number; // Altura customizável
    labelStyle?: StyleProp<TextStyle>;
    boxStyle?: StyleProp<ViewStyle>;  // BoxStyle agora deve ser ViewStyle
    inputStyle?: StyleProp<TextStyle>;
    customPaddingLeft?: number;
};

export const Input = forwardRef((props: Props, ref: LegacyRef<TextInput> | null) => {
    const {
        IconLeft,
        IconRight,  // Corrigido para "IconRight"
        iconLeftName,
        iconRightName,
        title,
        onIconLeftPress,
        onIconRightPress,  // Corrigido para "onIconRightPress"
        height,
        labelStyle,
        boxStyle,
        inputStyle,
        customPaddingLeft,
        ...rest
    } = props;

    const calculateSizeWidth = () => {
        if (IconLeft && IconRight) {
            return "80%";
        } else if (IconLeft || IconRight) {
            return "90%";
        } else {
            return "100%";
        }
    };

    const calculateSizePaddingLeft = () => {
        if (customPaddingLeft !== undefined) {
            return customPaddingLeft; // Se customPaddingLeft for fornecido, use esse valor
        }
        if (IconLeft && IconRight) {
            return 0;
        } else if (IconLeft || IconRight) {
            return 10;
        } else {
            return 20;
        }
    };

    return (
        <>
            {title && <Text style={[style.titleInput, labelStyle]}>{title}</Text>}
            <View
                style={[style.boxInput, boxStyle, { paddingLeft: calculateSizePaddingLeft(), height: height || 50 }]} // boxStyle aplicado aqui
            >
                {IconLeft && iconLeftName && (
                    <TouchableOpacity onPress={onIconLeftPress} style={style.Button}>
                        <IconLeft
                            name={iconLeftName as any}
                            size={20}
                            color={themas.Colors.gray}
                            style={style.Icon}
                        />
                    </TouchableOpacity>
                )}
                <TextInput
                    {...rest}
                    style={[style.input, inputStyle, { width: calculateSizeWidth() }]} // inputStyle aplicado aqui
                    ref={ref}
                />
                {IconRight && iconRightName && (  // Corrigido para "IconRight"
                    <TouchableOpacity onPress={onIconRightPress} style={style.Button}>
                        <IconRight  // Corrigido para "IconRight"
                            name={iconRightName as any}
                            size={20}
                            color={themas.Colors.gray}
                            style={style.Icon}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
});

export const style = StyleSheet.create({
    boxInput: {
        width: '100%',
        height: 50,
        borderWidth: 0,
        borderRadius: 10,
        backgroundColor: themas.Colors.bgScreen,
        marginTop: 23,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    input: {
        color: themas.Colors.primary,
        height: '100%',
        paddingVertical: 10,
        fontSize: 16,
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