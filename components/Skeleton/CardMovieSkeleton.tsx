import React from "react"
import { Animated, StyleSheet, View } from "react-native"
import { Card, useTheme } from "react-native-paper"

const SkeletonCard = () => {
  const animatedValue = new Animated.Value(0)

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
    ).start()
  }, [])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Card
        mode="contained"
        style={styles.card}
        theme={{
          roundness: 2,
        }}
      >
        <Animated.View
          style={[
            styles.cover,
            { opacity, backgroundColor: theme.colors.surfaceDisabled },
          ]}
        />
        <Card.Content>
          <Animated.View
            style={[
              styles.title,
              { opacity, backgroundColor: theme.colors.surfaceDisabled },
            ]}
          />
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    marginVertical: 4,
    width: "100%",
  },
  cover: {
    height: 120,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  title: {
    height: 16,
    marginTop: 8,
    width: "80%",
    borderRadius: 4,
  },
})

export default SkeletonCard
