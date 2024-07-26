import { RefreshControl, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  Card,
  useTheme,
  Text,
  ActivityIndicator,
  FAB,
  Surface,
} from "react-native-paper";
import { decode } from "html-entities";
import MovieService from "../service/MovieService";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";
import { StatusBar } from "expo-status-bar";
import { HomeResult, List } from "../types";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";
import { useAppStore } from "../zustand/appState";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";

const HomeScreen = () => {
  const [movies, setMovies] = useState({} as HomeResult);
  const [page, setPage] = useState(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = React.useRef<FlashList<List>>(null);
  const navigation = useNavigation<navigation<"HomeTab">>();

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
    setMovies(respone);
    setLoading(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    getMovies(1);
    setRefreshing(false);
  }, []);

  const handleLoadMore = async () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
    const respone: HomeResult = await MovieService.getAll(page);
    setMovies({
      ...movies,
      list: [...movies.list, ...respone.list],
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
          onPress={() => setViewType(viewType === "list" ? "grid" : "list")}
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
            removeClippedSubviews
            onEndReached={handleLoadMore}
            showsVerticalScrollIndicator={false}
            numColumns={viewType === "list" ? 1 : 2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies.list}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                <View style={{ width: "100%", paddingHorizontal: 4 }}>
                  <Card
                    theme={{
                      roundness: 2,
                    }}
                    mode="elevated"
                    style={{
                      marginVertical: 4,
                    }}
                    onPress={() =>
                      navigation.navigate("VideoPlayer", { movie: item })
                    }
                  >
                    <Card.Cover
                      theme={{
                        isV3: false,
                      }}
                      source={{ uri: item.poster_url }}
                      resizeMode="cover"
                    />
                    <View
                      style={{ position: "absolute", bottom: 55, right: 5 }}
                    >
                      <Surface
                        elevation={5}
                        style={{
                          borderRadius: 3,
                          padding: 2,
                          opacity: 0.85,
                        }}
                        mode="flat"
                      >
                        <Text variant="labelSmall">{item.time}</Text>
                      </Surface>
                    </View>
                    <Card.Content>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontWeight: "bold",
                        }}
                        variant="labelMedium"
                        lineBreakMode="middle"
                      >
                        {decode(item.name)}
                      </Text>
                    </Card.Content>
                  </Card>
                </View>
              );
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
