import React from "react";
import { Text, View, StyleSheet } from 'react-native';

type Props = {
  caption: string,
  color: string,
  selected?: boolean
}

export function Flag({ caption, color, selected }: Props) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color },
        selected && { borderWidth: 2 }
      ]}
    >
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  caption: {
    color: '#FFF'
  }
});