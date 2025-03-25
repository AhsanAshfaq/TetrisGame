import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

import Board from './Board';
import Tetromino from './Tetromino';
import GameSystem from '../systems/GameSystem';
import { createEmptyBoard, randomTetromino } from '../utils/gameHelpers';
import { BOARD_WIDTH, COLORS, BLOCK_SIZE } from '../utils/constants';

// Import the background image
import backgroundImage from '../assets/images/background.jpg';

const TetrisGame: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [board, setBoard] = useState(createEmptyBoard());
  const [level, setLevel] = useState(0);
  
  // Refs for sound effects
  const moveSound = useRef<Audio.Sound | null>(null);
  const rotateSound = useRef<Audio.Sound | null>(null);
  const dropSound = useRef<Audio.Sound | null>(null);
  const clearSound = useRef<Audio.Sound | null>(null);
  const gameOverSound = useRef<Audio.Sound | null>(null);
  
  // Initialize entities for the game engine
  const initialBoard = createEmptyBoard();
  const initialTetromino = randomTetromino();
  const initialPosition = {
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0,
  };
  
  // Load sound effects
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Load audio files
        // Since we don't have actual sound files, we'll handle this part carefully to avoid errors
        try {
          const { sound: move } = await Audio.Sound.createAsync(
            require('../assets/sounds/move.mp3')
          );
          moveSound.current = move;
        } catch (error) {
          console.log('Error loading move sound');
        }
        
        try {
          const { sound: rotate } = await Audio.Sound.createAsync(
            require('../assets/sounds/rotate.mp3')
          );
          rotateSound.current = rotate;
        } catch (error) {
          console.log('Error loading rotate sound');
        }
        
        try {
          const { sound: drop } = await Audio.Sound.createAsync(
            require('../assets/sounds/drop.mp3')
          );
          dropSound.current = drop;
        } catch (error) {
          console.log('Error loading drop sound');
        }
        
        try {
          const { sound: clear } = await Audio.Sound.createAsync(
            require('../assets/sounds/clear.mp3')
          );
          clearSound.current = clear;
        } catch (error) {
          console.log('Error loading clear sound');
        }
        
        try {
          const { sound: gameOver } = await Audio.Sound.createAsync(
            require('../assets/sounds/gameover.mp3')
          );
          gameOverSound.current = gameOver;
        } catch (error) {
          console.log('Error loading game over sound');
        }
      } catch (error) {
        console.log('Error loading sounds', error);
      }
    };
    
    loadSounds();
    
    return () => {
      // Unload sounds on cleanup
      const unloadSounds = async () => {
        if (moveSound.current) await moveSound.current.unloadAsync();
        if (rotateSound.current) await rotateSound.current.unloadAsync();
        if (dropSound.current) await dropSound.current.unloadAsync();
        if (clearSound.current) await clearSound.current.unloadAsync();
        if (gameOverSound.current) await gameOverSound.current.unloadAsync();
      };
      
      unloadSounds();
    };
  }, []);
  
  useEffect(() => {
    if (isGameOver && gameOverSound.current) {
      gameOverSound.current.playAsync();
      setRunning(false);
    }
  }, [isGameOver]);
  
  const playSound = async (soundRef: React.MutableRefObject<Audio.Sound | null>) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.log('Error playing sound', error);
    }
  };
  
  const startGame = () => {
    setRunning(true);
    setScore(0);
    setLevel(0);
    setIsGameOver(false);
    setBoard(createEmptyBoard());
    
    const gameInitialBoard = createEmptyBoard();
    const gameInitialTetromino = randomTetromino();
    const gameInitialPosition = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
    };
    
    if (gameEngine) {
      const entities = {
        board: {
          grid: gameInitialBoard,
          renderer: <Board board={gameInitialBoard} />,
        },
        activeTetromino: {
          ...gameInitialTetromino,
          renderer: <Tetromino 
            shape={gameInitialTetromino.shape} 
            type={gameInitialTetromino.type} 
            position={{
              x: gameInitialPosition.x * BLOCK_SIZE,
              y: gameInitialPosition.y * BLOCK_SIZE,
            }} 
          />,
        },
        position: gameInitialPosition,
        score: 0,
        level: 0,
        isGameOver: false,
        lastDropTime: Date.now(),
        sounds: {
          move: moveSound,
          rotate: rotateSound,
          drop: dropSound,
          clear: clearSound,
          gameOver: gameOverSound,
          playSound: playSound,
        },
      };
      
      gameEngine.swap(entities);
    }
  };
  
  const onEvent = (e: any) => {
    if (e.type === 'game-over') {
      setIsGameOver(true);
    } else if (e.type === 'score-update') {
      setScore(e.score);
      setLevel(Math.floor(e.score / 1000));
    } else if (e.type === 'board-update') {
      setBoard(e.board);
    } else if (e.type === 'move') {
      playSound(moveSound);
    } else if (e.type === 'rotate') {
      playSound(rotateSound);
    } else if (e.type === 'drop') {
      playSound(dropSound);
    } else if (e.type === 'rows-cleared') {
      playSound(clearSound);
    }
  };
  
  // Control action handlers
  const handleRotate = () => {
    if (gameEngine && running && !isGameOver) {
      gameEngine.dispatch({ type: 'direct-control', action: 'rotate' });
    }
  };
  
  const handleMoveLeft = () => {
    if (gameEngine && running && !isGameOver) {
      gameEngine.dispatch({ type: 'direct-control', action: 'left' });
    }
  };
  
  const handleMoveRight = () => {
    if (gameEngine && running && !isGameOver) {
      gameEngine.dispatch({ type: 'direct-control', action: 'right' });
    }
  };
  
  const handleDrop = () => {
    if (gameEngine && running && !isGameOver) {
      gameEngine.dispatch({ type: 'direct-control', action: 'drop' });
    }
  };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <Text style={styles.title}>Tetris</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.level}>Level: {level}</Text>
      </View>
      
      <View style={styles.gameContainer}>
        {isGameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <GameEngine
          ref={(ref) => { setGameEngine(ref); }}
          style={styles.gameEngine}
          systems={[GameSystem]}
          entities={{
            board: {
              grid: initialBoard,
              renderer: <Board board={initialBoard} />,
            },
            activeTetromino: {
              ...initialTetromino,
              renderer: <Tetromino 
                shape={initialTetromino.shape} 
                type={initialTetromino.type} 
                position={{
                  x: initialPosition.x * BLOCK_SIZE,
                  y: initialPosition.y * BLOCK_SIZE,
                }} 
              />,
            },
            position: initialPosition,
            score: 0,
            level: 0,
            isGameOver: false,
            lastDropTime: Date.now(),
            sounds: {
              move: moveSound,
              rotate: rotateSound,
              drop: dropSound,
              clear: clearSound,
              gameOver: gameOverSound,
              playSound: playSound,
            },
          }}
          running={running}
          onEvent={onEvent}
        >
          {!running && !isGameOver && (
            <View style={styles.startContainer}>
              <Text style={styles.gameTitle}>TETRIS</Text>
              <TouchableOpacity style={styles.button} onPress={startGame}>
                <Text style={styles.buttonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
          )}
        </GameEngine>
        
        {running && !isGameOver && (
          <View style={styles.controlsContainer}>
            {/* Top row - rotate button */}
            <TouchableOpacity 
              style={[styles.controlButton, styles.rotateButton]} 
              onPress={handleRotate}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>ROTATE</Text>
            </TouchableOpacity>
            
            {/* Middle row - left and right buttons */}
            <View style={styles.movementRow}>
              <TouchableOpacity 
                style={[styles.controlButton, styles.moveButton]} 
                onPress={handleMoveLeft}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>←</Text>
              </TouchableOpacity>
              
              <View style={{width: 120}} />
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.moveButton]} 
                onPress={handleMoveRight}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>→</Text>
              </TouchableOpacity>
            </View>
            
            {/* Bottom row - drop button */}
            <TouchableOpacity 
              style={[styles.controlButton, styles.dropButton]} 
              onPress={handleDrop}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>DROP</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.controlInfo}>
        <Text style={styles.controlText}>Controls:</Text>
        <Text style={styles.controlText}>• Tap ROTATE button to rotate</Text>
        <Text style={styles.controlText}>• Tap ← or → to move</Text>
        <Text style={styles.controlText}>• Tap DROP for fast drop</Text>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  level: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameContainer: {
    width: width * 0.9,
    height: height * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gameEngine: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  startContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.I,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 5,
  },
  gameOverContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  finalScore: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: COLORS.I,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  controlInfo: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controlText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
  },
  
  // Controls styling
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rotateButton: {
    alignSelf: 'center',
    width: 120,
    backgroundColor: 'rgba(255, 255, 0, 0.4)',
    marginTop: 10,
    paddingVertical: 15,
  },
  movementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  moveButton: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 255, 255, 0.4)',
    fontSize: 36,
  },
  dropButton: {
    alignSelf: 'center',
    width: 120,
    backgroundColor: 'rgba(255, 0, 255, 0.4)',
    marginBottom: 10,
    paddingVertical: 15,
  }
});

export default TetrisGame; 