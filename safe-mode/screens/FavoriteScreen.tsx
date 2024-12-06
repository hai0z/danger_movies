import { View } from "react-native"
import React from "react"
import { Appbar, useTheme, FAB } from "react-native-paper"
import { StatusBar } from "expo-status-bar"
import { useAppStore } from "../../zustand/appState"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import MovieItem from "../components/MovieItem"
import { Item } from "../types"

const FavoriteScreen = () => {
  const theme = useTheme()

  const scrollViewRef = React.useRef<FlashList<Item>>(null)

  const [isScrolled, setIsScrolled] = React.useState(false)

  const [themeMode, setThemeMode] = useAppStore((state) => [
    state.theme,
    state.setTheme,
  ])

  const [viewType, setViewType] = useAppStore((state) => [
    state.viewType,
    state.setViewType,
  ])

  const likedVideos = useAppStore((state) => state.likedAnglesMovies)

  console.log(likedVideos)
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
        <Appbar.Action
          icon={viewType === "list" ? "view-grid-outline" : "view-list"}
          onPress={() => {
            setViewType(viewType === "list" ? "grid" : "list")
            setIsScrolled(false)
          }}
        />
      </Appbar.Header>

      <View style={{ flex: 1 }} key={viewType}>
        <MasonryFlashList
          onScroll={(e) => {
            setIsScrolled(e.nativeEvent.contentOffset.y > 450)
          }}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          numColumns={viewType === "list" ? 1 : 2}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          data={likedVideos}
          renderItem={({ item }) => {
            return <MovieItem item={item} />
          }}
          estimatedItemSize={240}
        />
      </View>
    </View>
  )
}

export default FavoriteScreen
