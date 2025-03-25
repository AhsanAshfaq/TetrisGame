import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES } from './constants';

// Create an empty board
export const createEmptyBoard = () => {
  return Array.from(
    { length: BOARD_HEIGHT },
    () => Array(BOARD_WIDTH).fill(0)
  );
};

// Check if tetromino collides with board
export const checkCollision = (
  board: number[][],
  tetromino: number[][],
  position: { x: number; y: number }
) => {
  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      // Check if we're on a tetromino cell
      if (tetromino[y][x] !== 0) {
        const boardX = x + position.x;
        const boardY = y + position.y;
        
        // Check if our position is inside the game board's boundaries
        const isOutOfBounds = 
          boardX < 0 || 
          boardX >= BOARD_WIDTH || 
          boardY >= BOARD_HEIGHT;
        
        // Check if we're colliding with a non-empty cell on the board
        const isCollision = 
          !isOutOfBounds && 
          boardY >= 0 && 
          board[boardY][boardX] !== 0;
        
        if (isOutOfBounds || isCollision) {
          return true;
        }
      }
    }
  }
  return false;
};

// Rotate a tetromino
export const rotateTetromino = (tetromino: number[][], direction: 1 | -1) => {
  // Transpose the tetromino
  const rotated = tetromino.map((_, index) => 
    tetromino.map(col => col[index])
  );
  
  // Reverse each row to get a rotated matrix
  if (direction === 1) {
    return rotated.map(row => [...row].reverse());
  }
  
  // Reverse each column to rotate counter-clockwise
  return rotated.reverse();
};

// Generate a random tetromino
export const randomTetromino = () => {
  const shapes = Object.keys(TETROMINOES) as Array<keyof typeof TETROMINOES>;
  const randShape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape: TETROMINOES[randShape],
    type: randShape,
  };
};

// Merge the active tetromino with the game board
export const mergeTetrominoWithBoard = (
  board: number[][],
  tetromino: number[][],
  position: { x: number; y: number },
  value: number
) => {
  const newBoard = [...board.map(row => [...row])];
  
  tetromino.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        const boardY = y + position.y;
        const boardX = x + position.x;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = value;
        }
      }
    });
  });
  
  return newBoard;
};

// Check for completed rows and remove them
export const removeCompletedRows = (board: number[][]) => {
  const newBoard = [...board];
  let clearedRows = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell !== 0)) {
      // Remove the completed row and add an empty row at the top
      newBoard.splice(y, 1);
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      clearedRows++;
      y++; // Check the same row again as the rows have shifted
    }
  }
  
  return { newBoard, clearedRows };
}; 