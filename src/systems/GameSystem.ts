import { BOARD_WIDTH, BLOCK_SIZE, SPEEDS, TETROMINOES } from '../utils/constants';
import { 
  checkCollision, 
  mergeTetrominoWithBoard, 
  randomTetromino, 
  rotateTetromino,
  removeCompletedRows,
  createEmptyBoard
} from '../utils/gameHelpers';

const GameSystem = (entities: any, { touches, dispatch, time, events = [] }: any) => {
  if (!entities) return {};
  
  const { 
    board = { grid: createEmptyBoard() }, 
    activeTetromino = randomTetromino(), 
    position = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }, 
    isGameOver = false, 
    lastDropTime = Date.now(), 
    score = 0,
    level = 0,
    sounds = {},
  } = entities;

  if (isGameOver) {
    return entities;
  }

  // Ensure board grid exists
  if (!board.grid) {
    board.grid = createEmptyBoard();
  }

  // Ensure activeTetromino shape exists
  if (!activeTetromino.shape) {
    const newTetromino = randomTetromino();
    activeTetromino.shape = newTetromino.shape;
    activeTetromino.type = newTetromino.type;
  }

  // Time-based drop
  const now = Date.now();
  const dropSpeed = SPEEDS.NORMAL - Math.min(level * 50, SPEEDS.NORMAL - SPEEDS.FAST);
  
  if (now - lastDropTime > dropSpeed) {
    const newPosition = { ...position, y: position.y + 1 };
    
    if (!checkCollision(board.grid, activeTetromino.shape, newPosition)) {
      // Move tetromino down
      position.y = newPosition.y;
      entities.lastDropTime = now;
      
      // Update the renderer position
      if (activeTetromino.renderer) {
        activeTetromino.renderer = {
          ...activeTetromino.renderer,
          props: {
            ...activeTetromino.renderer.props,
            position: {
              x: position.x * BLOCK_SIZE,
              y: position.y * BLOCK_SIZE,
            },
          },
        };
      }
    } else {
      // Tetromino has landed
      // Play drop sound
      dispatch({ type: 'drop' });
      
      // Merge the tetromino with the board
      board.grid = mergeTetrominoWithBoard(
        board.grid, 
        activeTetromino.shape, 
        position, 
        1
      );
      
      // Check for completed rows and update score
      const { newBoard, clearedRows } = removeCompletedRows(board.grid);
      board.grid = newBoard;
      
      // Update the board renderer
      if (board.renderer && board.renderer.props) {
        board.renderer = {
          ...board.renderer,
          props: {
            ...board.renderer.props,
            board: newBoard,
          },
        };
      }
      
      // Update board state in the main component
      dispatch({ type: 'board-update', board: newBoard });
      
      if (clearedRows > 0) {
        // Update score based on cleared rows
        const rowPoints = [0, 100, 300, 500, 800];
        const newScore = score + rowPoints[clearedRows] * (level + 1);
        entities.score = newScore;
        
        // Update level based on score
        entities.level = Math.floor(newScore / 1000);
        
        // Dispatch events
        dispatch({ type: 'rows-cleared', clearedRows });
        dispatch({ type: 'score-update', score: newScore });
      }
      
      // Reset position and get a new tetromino
      position.x = Math.floor(BOARD_WIDTH / 2) - 1;
      position.y = 0;
      
      // Generate a new random tetromino
      const newTetromino = randomTetromino();
      activeTetromino.shape = newTetromino.shape;
      activeTetromino.type = newTetromino.type;
      
      // Update the renderer for the new tetromino
      if (activeTetromino.renderer) {
        activeTetromino.renderer = {
          type: activeTetromino.renderer.type,
          props: {
            shape: newTetromino.shape,
            type: newTetromino.type,
            position: {
              x: position.x * BLOCK_SIZE,
              y: position.y * BLOCK_SIZE,
            },
          },
        };
      }
      
      // Check if the new tetromino collides immediately
      if (checkCollision(board.grid, activeTetromino.shape, position)) {
        // Game over
        entities.isGameOver = true;
        dispatch({ type: 'game-over' });
        return entities;
      }
    }
  }

  // Handle direct control events (from buttons)
  if (events && events.length > 0) {
    for (const e of events) {
      if (e.type === 'direct-control') {
        handleDirectControl(e.action, entities, dispatch, activeTetromino, position, board.grid, now);
      }
    }
  }

  // Disable the original touch handling since we now use buttons
  // We keep this commented as reference
  /*
  // Handle touch events - process any type of touch
  if (touches && Array.isArray(touches)) {
    // Process any type of touch event (start, move, end)
    const allTouches = touches.filter(t => t && t.event);
    
    if (allTouches.length > 0) {
      const touch = allTouches[0]; // Use the first valid touch
      
      if (!touch.event || !touch.event.pageX || !touch.event.pageY) return entities;
      
      const touchX = touch.event.pageX;
      const touchY = touch.event.pageY;
      
      // Get the game area dimensions
      // If layout is not available, use reasonable defaults
      const width = (touch.event.layout && touch.event.layout.width) ? touch.event.layout.width : 300;
      const height = (touch.event.layout && touch.event.layout.height) ? touch.event.layout.height : 500;
      
      // Simplified controls with improved touch regions
      if (touchY < height * 0.33) {
        // Top third of screen - Rotate
        const rotated = rotateTetromino(activeTetromino.shape, 1);
        if (!checkCollision(board.grid, rotated, position)) {
          activeTetromino.shape = rotated;
          
          // Update the renderer for rotation
          if (activeTetromino.renderer) {
            activeTetromino.renderer = {
              ...activeTetromino.renderer,
              props: {
                ...activeTetromino.renderer.props,
                shape: rotated,
              },
            };
          }
          
          // Play rotate sound
          dispatch({ type: 'rotate' });
        }
      } else if (touchY > height * 0.67) {
        // Bottom third of screen - Speed up drop
        entities.lastDropTime = now - SPEEDS.NORMAL + SPEEDS.FAST;
      } else {
        // Middle section - Move left or right
        // Determine direction based on which half of the screen was touched
        const moveDirection = touchX < width / 2 ? -1 : 1;
        const newPosition = { 
          ...position, 
          x: position.x + moveDirection
        };
        
        if (!checkCollision(board.grid, activeTetromino.shape, newPosition)) {
          position.x = newPosition.x;
          
          // Update the renderer position
          if (activeTetromino.renderer) {
            activeTetromino.renderer = {
              ...activeTetromino.renderer,
              props: {
                ...activeTetromino.renderer.props,
                position: {
                  x: position.x * BLOCK_SIZE,
                  y: position.y * BLOCK_SIZE,
                },
              },
            };
          }
          
          // Play move sound
          dispatch({ type: 'move' });
        }
      }
    }
  }
  */

  return entities;
};

// Helper function to handle direct control actions
function handleDirectControl(
  action: string,
  entities: any,
  dispatch: any,
  activeTetromino: any,
  position: any,
  grid: any,
  now: number
) {
  switch (action) {
    case 'left': {
      // Move left
      const newPosition = { ...position, x: position.x - 1 };
      if (!checkCollision(grid, activeTetromino.shape, newPosition)) {
        position.x = newPosition.x;
        
        // Update the renderer position
        if (activeTetromino.renderer) {
          activeTetromino.renderer = {
            ...activeTetromino.renderer,
            props: {
              ...activeTetromino.renderer.props,
              position: {
                x: position.x * BLOCK_SIZE,
                y: position.y * BLOCK_SIZE,
              },
            },
          };
        }
        
        // Play move sound
        dispatch({ type: 'move' });
      }
      break;
    }
    case 'right': {
      // Move right
      const newPosition = { ...position, x: position.x + 1 };
      if (!checkCollision(grid, activeTetromino.shape, newPosition)) {
        position.x = newPosition.x;
        
        // Update the renderer position
        if (activeTetromino.renderer) {
          activeTetromino.renderer = {
            ...activeTetromino.renderer,
            props: {
              ...activeTetromino.renderer.props,
              position: {
                x: position.x * BLOCK_SIZE,
                y: position.y * BLOCK_SIZE,
              },
            },
          };
        }
        
        // Play move sound
        dispatch({ type: 'move' });
      }
      break;
    }
    case 'rotate': {
      // Rotate
      const rotated = rotateTetromino(activeTetromino.shape, 1);
      if (!checkCollision(grid, rotated, position)) {
        activeTetromino.shape = rotated;
        
        // Update the renderer for rotation
        if (activeTetromino.renderer) {
          activeTetromino.renderer = {
            ...activeTetromino.renderer,
            props: {
              ...activeTetromino.renderer.props,
              shape: rotated,
            },
          };
        }
        
        // Play rotate sound
        dispatch({ type: 'rotate' });
      }
      break;
    }
    case 'drop': {
      // Soft drop - move down faster
      entities.lastDropTime = now - SPEEDS.NORMAL + SPEEDS.FAST;
      break;
    }
    default:
      break;
  }
}

export default GameSystem; 