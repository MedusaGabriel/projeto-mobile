import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { themas } from '../../global/themes';

const icons: Array<'home' | 'star' | 'check' | 'alarm' | 'favorite'> = ['home', 'star', 'check', 'alarm', 'favorite'];
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

interface IconColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (icon: string) => void;
  onSelectColor: (color: string) => void;
  type: 'icon' | 'color';
}

const IconColorPickerModal: React.FC<IconColorPickerModalProps> = ({ visible, onClose, onSelectIcon, onSelectColor, type }) => {
  const handleSelectIcon = (icon: string) => {
    onSelectIcon(icon);
    onClose();
  };

  const handleSelectColor = (color: string) => {
    onSelectColor(color);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{type === 'icon' ? 'Selecione um Ícone' : 'Selecione uma Cor'}</Text>
          {type === 'icon' ? (
            <FlatList
              data={icons}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectIcon(item)} style={styles.iconButton}>
                  <MaterialIcons name={item} size={30} color={themas.Colors.primary} />
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={colors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectColor(item)} style={[styles.colorButton, { backgroundColor: item }]} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={30} color={themas.Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themas.Colors.primary,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: themas.Colors.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  iconButton: {
    margin: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  closeButton: {
    marginTop: 20,
  },
});

export default IconColorPickerModal;