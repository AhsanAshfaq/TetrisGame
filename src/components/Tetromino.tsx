import React from 'react';
import { View, StyleSheet } from 'react-native';
import Block from './Block';
import { COLORS, BLOCK_SIZE, TETROMINOES } from '../utils/constants';

interface TetrominoProps {
  shape?: number[][];
  type?: keyof typeof COLORS;
  position?: { x: number; y: number };
}

const Tetromino: React.FC<TetrominoProps> = ({ 
  shape = TETROMINOES.I, 
  type = 'I', 
  position = { x: 0, y: 0 } 
}) => {
  // Add a subtle shadow effect to the tetromino
  const shadowStyle = {
    shadowColor: COLORS[type],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  };
  
  // Ensure position is not undefined
  const safePosition = position || { x: 0, y: 0 };
  
  // Ensure shape is valid
  const safeShape = Array.isArray(shape) ? shape : TETROMINOES.I;
  
  return (
    <View 
      style={[
        styles.tetromino,
        {
          transform: [
            { translateX: safePosition.x },
            { translateY: safePosition.y }
          ],
          ...shadowStyle
        }
      ]}
    >
      {safeShape.map((row, y) => (
        <View key={`row-${y}`} style={styles.row}>
          {row.map((cell, x) => (
            cell !== 0 ? (
              <Block 
                key={`cell-${x}-${y}`} 
                color={COLORS[type]} 
              />
            ) : (
              <View 
                key={`cell-${x}-${y}`} 
                style={styles.emptyCell} 
              />
            )
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tetromino: {
    position: 'absolute',
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
  },
  emptyCell: {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
  },
});

export default Tetromino; 