import { ScrollView, View } from "react-native"
import React from "react"
import { Appbar, useTheme, FAB } from "react-native-paper"
import { StatusBar } from "expo-status-bar"
import { List } from "../types"
import { useAppStore } from "../zustand/appState"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import MovieItem from "../components/MovieItem"
import VipMovieItem from "../components/VipMovieItem"

const FavoriteScreen = () => {
  const theme = useTheme()

  const scrollViewRef = React.useRef<FlashList<List>>(null)

  const [isScrolled, setIsScrolled] = React.useState(false)

  const [themeMode, setThemeMode] = useAppStore((state) => [
    state.theme,
    state.setTheme,
  ])

  const [viewType, setViewType] = useAppStore((state) => [
    state.viewType,
    state.setViewType,
  ])

  const likedVideos = useAppStore((state) => state.likeVideos)
  const likedVipVideos = useAppStore((state) => state.VipMovie)

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <FAB
        visible={isScrolled}
        icon="chevron-up"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onPress={() =>
          scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true })
        }
      />
      <StatusBar
        backgroundColor="transparent"
        style={theme.dark ? "light" : "dark"}
      />
      <Appbar.Header>
        <Appbar.Content title={`Phim đã thích`} />
        <Appbar.Action
          icon={themeMode === "dark" ? "weather-sunny" : "weather-night"}
          onPress={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
        />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} key={viewType}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {likedVideos.length > 0 &&
            likedVideos.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: "50%",
                  }}
                >
                  <MovieItem key={index} item={item} />
                </View>
              )
            })}

          {likedVipVideos.length > 0 &&
            likedVipVideos.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: "50%",
                  }}
                >
                  <VipMovieItem key={index} item={item} />
                </View>
              )
            })}
        </View>
      </ScrollView>
    </View>
  )
}

export default FavoriteScreen
