# Tetris Game

A modern implementation of the classic Tetris game built with React Native and Expo. This version features smooth animations, touch controls, and a clean, minimalist design.

## Features

- 🎮 Touch-based controls
- 🎨 Modern, minimalist UI design
- 📱 Responsive layout that works on all iOS devices
- 🎯 Score tracking and level progression
- ⚡ Smooth animations and transitions
- 🎵 Sound effects (coming soon)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS device or simulator (for testing)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd TetrisGame
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

4. Open the game:
   - Scan the QR code with your iPhone's camera
   - Or press 'i' to open in iOS simulator

## How to Play

1. Tap the "Start Game" button to begin
2. Use the on-screen controls to:
   - Tap the top button to rotate the piece
   - Use the left/right buttons to move the piece horizontally
   - Tap the bottom button to drop the piece faster
3. Clear rows to score points and increase your level
4. Game ends when pieces stack up to the top

## Controls

- **Rotate**: Tap the top button to rotate the current piece
- **Move Left**: Tap the left arrow button
- **Move Right**: Tap the right arrow button
- **Drop Faster**: Tap the bottom button to instantly drop the piece

## Project Structure

```
TetrisGame/
├── src/
│   ├── components/     # React components
│   ├── systems/        # Game logic systems
│   ├── entities/       # Game entities
│   ├── constants/      # Game constants
│   └── types/         # TypeScript type definitions
├── assets/            # Game assets
└── App.tsx            # Main application entry point
```

## Technologies Used

- React Native
- Expo
- TypeScript
- React Native SVG
- React Native Reanimated

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the original Tetris game
- Built with React Native and Expo
- Uses React Native SVG for graphics
- Sound effects from [source] (to be added) 