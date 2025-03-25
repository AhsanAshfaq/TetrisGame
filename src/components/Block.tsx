import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BLOCK_SIZE } from '../utils/constants';

interface BlockProps {
  color: string;
}

const Block: React.FC<BlockProps> = ({ color }) => {
  // Create a lighter shade for the highlight effect
  const lighterColor = () => {
    const hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten the color
    r = Math.min(255, r + 60);
    g = Math.min(255, g + 60);
    b = Math.min(255, b + 60);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // Create a darker shade for the shadow effect
  const darkerColor = () => {
    const hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Darken the color
    r = Math.max(0, r - 40);
    g = Math.max(0, g - 40);
    b = Math.max(0, b - 40);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <View style={styles.blockContainer}>
      <View 
        style={[
          styles.block, 
          { backgroundColor: color }
        ]} 
      >
        {/* Add a highlight effect on the top-left */}
        <View style={[styles.highlight, { backgroundColor: lighterColor() }]} />
        
        {/* Add a shadow effect on the bottom-right */}
        <View style={[styles.shadow, { backgroundColor: darkerColor() }]} />
        
        {/* Add a slight reflection/glint */}
        <View style={styles.reflection} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    padding: 1, // Small gap between blocks
  },
  block: {
    flex: 1,
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '50%',
    opacity: 0.5,
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '50%',
    opacity: 0.5,
  },
  reflection: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Block; 