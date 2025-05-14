import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import colors from '@/constants/colors';

type VoteOptionProps = {
  option: {
    _id: string;
    text: string;
    votes: number;
  };
  index: number;
  selected: boolean;
  totalVotes: number;
  onPress: () => void;
  isRTL: boolean;
};

export default function VoteOption({
  option,
  index,
  selected,
  totalVotes,
  onPress,
  isRTL
}: VoteOptionProps) {
  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  
  // Get a unique color for each option
  const getOptionColor = (idx: number) => {
    const colors = [
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F97316', // orange
      '#10B981', // green
    ];
    return colors[idx % colors.length];
  };
  
  const color = getOptionColor(index);
  
  // Animated styles for progress bar
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${percentage}%`, { duration: 1000 }),
      backgroundColor: selected 
        ? withTiming(color, { duration: 300 })
        : withTiming(`${color}80`, { duration: 300 }) // 50% opacity version of the color
    };
  });
  
  return (
    <Pressable
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]}
      onPress={onPress}
      disabled={selected}
    >
      <Animated.View 
        style={[
          styles.progressBar,
          progressStyle
        ]} 
      />
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.optionText, 
            isRTL && styles.rtlText,
            selected && styles.selectedText
          ]}
        >
          {option.text}
        </Text>
        
        <View style={[styles.stats, isRTL && styles.statsRtl]}>
          <Text style={[styles.votes, selected && styles.selectedText]}>
            {option.votes} {isRTL ? '' : 'votes'}
          </Text>
          
          <Text style={[styles.percentage, { color }, selected && styles.selectedPercentage]}>
            {percentage}%
          </Text>
          
          {isRTL && (
            <Text style={[styles.votes, selected && styles.selectedText]}>
              صوت
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    minHeight: 60,
  },
  selectedContainer: {
    borderColor: colors.primary,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '0%',
    backgroundColor: `${colors.primary}30`,
  },
  content: {
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'Tajawal-Medium',
    writingDirection: 'rtl',
  },
  selectedText: {
    color: colors.text,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRtl: {
    flexDirection: 'row-reverse',
  },
  votes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textLight,
  },
  percentage: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  selectedPercentage: {
    color: colors.white,
  },
});