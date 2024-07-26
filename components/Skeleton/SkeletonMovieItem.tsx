import React, { useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { TouchableRipple, Divider, useTheme } from "react-native-paper";

const SkeletonMovieItem = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
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
      <TouchableRipple style={styles.touchable}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.image,
              { opacity, backgroundColor: theme.colors.surfaceDisabled },
            ]}
          />
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.text,
                styles.title,
                { opacity, backgroundColor: theme.colors.surfaceDisabled },
              ]}
            />
            <Animated.View
              style={[
                styles.text,
                styles.subtitle,
                { opacity, backgroundColor: theme.colors.surfaceDisabled },
              ]}
            />
          </View>
        </View>
      </TouchableRipple>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 4,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  image: {
    width: 75,
    height: 100,
    borderRadius: 6,
    marginLeft: 8,
  },
  content: {
    marginLeft: 8,
    flex: 1,
    marginRight: 8,
  },
  text: {
    height: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  title: {
    width: "80%",
  },
  subtitle: {
    width: "60%",
  },
});

export default SkeletonMovieItem;
