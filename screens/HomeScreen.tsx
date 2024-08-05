import { RefreshControl, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar, useTheme, ActivityIndicator, FAB } from "react-native-paper";
import MovieService from "../service/MovieService";
import { StatusBar } from "expo-status-bar";
import { HomeResult, List } from "../types";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";
import { useAppStore } from "../zustand/appState";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import MovieItem from "../components/MovieItem";

const HomeScreen = () => {
  const [movies, setMovies] = useState({} as HomeResult);
  const [page, setPage] = useState(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

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
  const getMovies = async (page: number) => {
    const respone: HomeResult = await MovieService.getAll(page);
    setMovies({
      ...respone,
      list: Array.from(
        new Map(respone.list.map((item) => [item.movie_code, item])).values()
      ),
    });
    setLoading(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    getMovies(1);
    setRefreshing(false);
  }, []);

  const handleLoadMore = async () => {
    if (page >= movies.pagecount) return;
    setLoadMoreLoading(true);
    setPage(page + 1);
    const respone: HomeResult = await MovieService.getAll(page);
    setMovies({
      ...movies,
      list: [
        ...movies.list,
        ...Array.from(
          new Map(respone.list.map((item) => [item.movie_code, item])).values()
        ),
      ],
    });
  };

  useEffect(() => {
    getMovies(1);
  }, []);

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
        <Appbar.Content title={`Tất cả phim`} />
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
      {!loading ? (
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              <View>
                {loadMoreLoading && page !== 1 && <ActivityIndicator />}
              </View>
            }
            onEndReached={handleLoadMore}
            showsVerticalScrollIndicator={false}
            numColumns={viewType === "list" ? 1 : 2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies.list}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return <MovieItem item={item} />;
            }}
            estimatedItemSize={240}
          />
        </Animated.View>
      ) : (
        <Animated.View
          key={viewType}
          style={{ flex: 1 }}
          exiting={FadeOut.duration(300)}
        >
          <MasonryFlashList
            numColumns={viewType === "list" ? 1 : 2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={Array.from({ length: 10 })}
            renderItem={(_) => (
              <View style={{ width: "100%", paddingHorizontal: 4 }}>
                <SkeletonCard />
              </View>
            )}
            estimatedItemSize={240}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default HomeScreen;
