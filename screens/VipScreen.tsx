import { RefreshControl, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  useTheme,
  ActivityIndicator,
  FAB,
  Chip,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import { useAppStore } from "../zustand/appState";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";

import { ListMovieResponse, Movie } from "../service/MovieType";
import ApiService, { MOVIE_CATEGORY } from "../service/VipService";
import VipMovieItem from "../components/VipMovieItem";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";

const theLoaiArr = [
  {
    id: "viet-nam-clip",
    name: "Việt Nam",
  },
  {
    id: "vietsub",
    name: "Việt sub",
  },
  {
    id: "chau-au",
    name: "Châu Âu",
  },
  {
    id: "trung-quoc",
    name: "Trung Quốc",
  },
  {
    id: "han-quoc-18-",
    name: "Hàn Quốc",
  },
  {
    id: "khong-che",
    name: "Không che",
  },
  {
    id: "jav-hd",
    name: "JAV HD",
  },
  {
    id: "hentai",
    name: "Hentai",
  },
];
const VipScreen = () => {
  const [movies, setMovies] = useState({} as ListMovieResponse);
  const [page, setPage] = useState(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = React.useRef<FlashList<Movie>>(null);

  const [isScrolled, setIsScrolled] = React.useState(false);

  const [themeMode, setThemeMode] = useAppStore((state) => [
    state.theme,
    state.setTheme,
  ]);
  const [appMode, setAppMode] = useAppStore((state) => [
    state.appMode,
    state.setAppMode,
  ]);
  const [viewType, setViewType] = useAppStore((state) => [
    state.viewType,
    state.setViewType,
  ]);
  const [isAppModeChanged, setIsAppModeChanged] = React.useState(false);

  const [selectedTheLoai, setSelectedTheLoai] = useState(theLoaiArr[1].id);

  const getMovies = async (page: number) => {
    setLoading(true);
    const respone: ListMovieResponse = await ApiService.getByCategory(
      selectedTheLoai as MOVIE_CATEGORY,
      page
    );
    setMovies(respone);
    setLoading(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    getMovies(1);
    setRefreshing(false);
  }, []);

  const handleLoadMore = async (currentPage: number) => {
    if (page >= movies.page.last_page) return;
    setLoadMoreLoading(true);
    setPage(currentPage);
    const respone: ListMovieResponse = await ApiService.getByCategory(
      selectedTheLoai as MOVIE_CATEGORY,
      page
    );
    setMovies({
      ...movies,
      movies: [...movies.movies, ...respone.movies],
    });
  };

  useEffect(() => {
    getMovies(1);
  }, [selectedTheLoai]);

  useEffect(() => {
    setIsAppModeChanged(true);
    setPage(1);
    const timer = setTimeout(() => {
      setIsAppModeChanged(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appMode]);
  if (isAppModeChanged) {
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
        exiting={FadeOut.duration(1000)}
      >
        <StatusBar
          backgroundColor="transparent"
          style={theme.dark ? "light" : "dark"}
        />
        <Text style={{ fontSize: 69 }}>
          {appMode === "angle" ? "😇" : "😈"}{" "}
        </Text>
      </Animated.View>
    );
  }
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
        <Appbar.Content title={`Tất cả phim `} />
        <Appbar.Action
          delayLongPress={1000}
          onLongPress={() =>
            setAppMode(appMode === "angle" ? "devil" : "angle")
          }
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
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                }}
              >
                {loadMoreLoading && page !== 1 && <ActivityIndicator />}
              </View>
            }
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                  marginVertical: 4,
                }}
              >
                {theLoaiArr.map((item) => (
                  <Chip
                    mode="flat"
                    key={item.id}
                    onPress={() => setSelectedTheLoai(item.id)}
                    selected={selectedTheLoai === item.id}
                    compact
                  >
                    <Text>{item.name}</Text>
                  </Chip>
                ))}
              </View>
            }
            onEndReached={() => handleLoadMore(page + 1)}
            showsVerticalScrollIndicator={false}
            numColumns={viewType === "list" ? 1 : 2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies.movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return <VipMovieItem item={item} />;
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

export default VipScreen;
