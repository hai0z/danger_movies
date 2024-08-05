import { View } from "react-native";
import React from "react";
import { Appbar, useTheme, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { List } from "../types";
import { useAppStore } from "../zustand/appState";
import Animated, { FadeIn } from "react-native-reanimated";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import MovieItem from "../components/MovieItem";

const FavoriteScreen = () => {
  const theme = useTheme();

  const scrollViewRef = React.useRef<FlashList<List>>(null);

  const [isScrolled, setIsScrolled] = React.useState(false);

  const [themeMode, setThemeMode] = useAppStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  const [viewType, setViewType] = useAppStore((state) => [
    state.viewType,
    state.setViewType,
  ]);

  const likedVideos = useAppStore((state) => state.likeVideos);

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
            setViewType(viewType === "list" ? "grid" : "list");
            setIsScrolled(false);
          }}
        />
      </Appbar.Header>

      <Animated.View
        style={{ flex: 1 }}
        key={viewType}
        entering={FadeIn.duration(300)}
      >
        <MasonryFlashList
          onScroll={(e) => {
            setIsScrolled(e.nativeEvent.contentOffset.y > 450);
          }}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          numColumns={viewType === "list" ? 1 : 2}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          data={likedVideos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return <MovieItem item={item} />;
          }}
          estimatedItemSize={240}
        />
      </Animated.View>
    </View>
  );
};

export default FavoriteScreen;
