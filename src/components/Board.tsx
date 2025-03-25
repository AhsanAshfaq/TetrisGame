import React from 'react';
import { View, StyleSheet } from 'react-native';
import Block from './Block';
import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, COLORS } from '../utils/constants';
import { createEmptyBoard } from '../utils/gameHelpers';

interface BoardProps {
  board?: (number | string)[][];
}

const Board: React.FC<BoardProps> = ({ board = createEmptyBoard() }) => {
  // Ensure board is not undefined
  const safeBoard = board || createEmptyBoard();
  
  return (
    <View style={styles.board}>
      {safeBoard.map((row, y) => (
        <View key={`row-${y}`} style={styles.row}>
          {row.map((cell, x) => (
            <View key={`cell-${x}-${y}`}>
              {cell !== 0 ? (
                <Block 
                  color={typeof cell === 'string' ? cell : COLORS.I} 
                />
              ) : (
                <View style={styles.emptyCell} />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: BOARD_WIDTH * BLOCK_SIZE,
    height: BOARD_HEIGHT * BLOCK_SIZE,
    backgroundColor: COLORS.BOARD,
    borderWidth: 2,
    borderColor: '#555',
  },
  row: {
    flexDirection: 'row',
  },
  emptyCell: {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    borderWidth: 1,
    borderColor: COLORS.GRID,
    backgroundColor: COLORS.BOARD,
  },
});

export default Board; 