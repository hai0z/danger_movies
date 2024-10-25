import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

const SkeletonLoading = ({
  width,
  height,
}: {
  width: number | `${number}%`;
  height?: number | `${number}%`;
}) => {
  const animatedValue = new Animated.Value(0);
  const theme = useTheme();
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View>
      <Animated.View
        style={[
          styles.skeletonItem,
          {
            opacity,
            backgroundColor: theme.colors.surfaceDisabled,
            width,
            height: height ? height : 20,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonItem: {
    marginBottom: 6,
    borderRadius: 4,
  },
});

export default SkeletonLoading;
