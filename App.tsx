import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TetrisGame from './src/components/TetrisGame';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TetrisGame />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
