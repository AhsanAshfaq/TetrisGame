// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BLOCK_SIZE = 30;

// Colors for tetromino pieces
export const COLORS = {
  I: '#00FFFF', // Cyan
  J: '#0000FF', // Blue
  L: '#FF8000', // Orange
  O: '#FFFF00', // Yellow
  S: '#00FF00', // Green
  T: '#800080', // Purple
  Z: '#FF0000', // Red
  GHOST: '#BEBEBE', // Grey
  BOARD: '#000000', // Black
  GRID: '#333333', // Dark Grey
};

// Tetromino shapes
export const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// Game speeds (in milliseconds)
export const SPEEDS = {
  SLOW: 800,
  NORMAL: 500,
  FAST: 200,
  DROP: 20,
};

// Scoring
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

// Level
export const LEVEL = {
  LINES_PER_LEVEL: 10,
}; 