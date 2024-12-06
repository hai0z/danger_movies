import { RefreshControl, View, Text } from "react-native"
import React, { useEffect, useState } from "react"
import { Appbar, useTheme, ActivityIndicator, FAB } from "react-native-paper"
import MovieService from "../service/MovieService"
import { StatusBar } from "expo-status-bar"
import { HomeResult, Item } from "../types/index"
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton"
import { useAppStore } from "../../zustand/appState"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import MovieItem from "../components/MovieItem"

const HomeScreen = () => {
  const [movies, setMovies] = useState({} as HomeResult)

  const [page, setPage] = useState(1)

  const [loadMoreLoading, setLoadMoreLoading] = useState(false)

  const theme = useTheme()

  const [refreshing, setRefreshing] = React.useState(false)

  const [loading, setLoading] = useState(true)

  const scrollViewRef = React.useRef<FlashList<Item>>(null)

  const [isScrolled, setIsScrolled] = React.useState(false)

  const [themeMode, setThemeMode] = useAppStore((state) => [
    state.theme,
    state.setTheme,
  ])

  const [appMode, setAppMode] = useAppStore((state) => [
    state.appMode,
    state.setAppMode,
  ])

  const [viewType, setViewType] = useAppStore((state) => [
    state.viewType,
    state.setViewType,
  ])

  const [isAppModeChanged, setIsAppModeChanged] = React.useState(false)

  const getMovies = async (page: number) => {
    const respone: HomeResult = await MovieService.getAll(page)
    setMovies(respone)
    setLoading(false)
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setLoading(true)
    getMovies(1)
    setRefreshing(false)
  }, [])

  const handleLoadMore = async (currentPage: number) => {
    if (page >= movies.paginate.total_page) return
    setLoadMoreLoading(true)
    setPage(currentPage)
    const respone: HomeResult = await MovieService.getAll(currentPage)
    setMovies({
      ...movies,
      items: [...movies.items, ...respone.items],
    })
  }

  useEffect(() => {
    getMovies(1)
  }, [])

  useEffect(() => {
    setIsAppModeChanged(true)
    setPage(1)
    const timer = setTimeout(() => {
      setIsAppModeChanged(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [appMode])

  if (isAppModeChanged) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <StatusBar
          backgroundColor="transparent"
          style={theme.dark ? "light" : "dark"}
        />
        <Text style={{ fontSize: 69 }}>
          {" "}
          {appMode === "angle" ? "😇" : "😈"}{" "}
        </Text>
      </View>
    )
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
        <Appbar.Content title={`Phim mới `} />
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
            setViewType(viewType === "list" ? "grid" : "list")
            setIsScrolled(false)
          }}
        />
      </Appbar.Header>
      {!loading ? (
        <View style={{ flex: 1 }} key={viewType}>
          <MasonryFlashList
            onScroll={(e) => {
              setIsScrolled(e.nativeEvent.contentOffset.y > 450)
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
            onEndReached={() => handleLoadMore(page + 1)}
            showsVerticalScrollIndicator={false}
            numColumns={viewType === "list" ? 1 : 2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies.items}
            renderItem={({ item }) => {
              return <MovieItem item={item} />
            }}
            estimatedItemSize={240}
          />
        </View>
      ) : (
        <View key={viewType} style={{ flex: 1 }}>
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
        </View>
      )}
    </View>
  )
}

export default HomeScreen
