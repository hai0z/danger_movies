import { View } from "react-native"
import React, { useEffect, useState } from "react"
import { Appbar, useTheme, ActivityIndicator, FAB } from "react-native-paper"
import MovieService, { Category } from "../service/MovieService"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import { useNavigation } from "@react-navigation/native"
import { navigation, route } from "../types/StackParamlist"
import { HomeResult, Item } from "../types"
import { StatusBar } from "expo-status-bar"
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton"
import MovieItem from "../components/MovieItem"

interface Props {
  route: route<"Category">
}

const CategoryScreen = ({ route }: Props) => {
  const [movies, setMovies] = useState({} as HomeResult)
  const [page, setPage] = useState(1)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const theme = useTheme()
  const { categoryName, title, slug } = route.params

  const [loading, setLoading] = useState(true)

  const [isScrolling, setIsScrolling] = useState(false)

  const navigation = useNavigation<navigation<"HomeTab">>()
  const scrollViewRef = React.useRef<FlashList<Item>>(null)

  const getMovies = async () => {
    setLoading(true)
    const respone = await MovieService.getByCategory(categoryName, page, slug)
    setMovies(respone)
    setLoading(false)
  }

  useEffect(() => {
    getMovies()
  }, [route.params])

  const handleLoadMore = async (currentPage: number) => {
    if (page >= movies.paginate?.total_page) return
    setLoadMoreLoading(true)
    setPage(currentPage)
    const respone = await MovieService.getByCategory(
      categoryName,
      currentPage,
      slug
    )
    setMovies({
      ...movies,
      items: [...movies.items, ...respone.items],
    })
    setLoadMoreLoading(false)
  }

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <FAB
        icon="chevron-up"
        visible={isScrolling}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 48,
          zIndex: 999,
        }}
        onPress={() => {
          scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true })
        }}
      />

      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} />
      </Appbar.Header>
      {!loading ? (
        <View style={{ flex: 1 }}>
          <MasonryFlashList
            onScroll={({ nativeEvent }) => {
              if (nativeEvent.contentOffset.y > 450) {
                setIsScrolling(true)
              } else {
                setIsScrolling(false)
              }
            }}
            ref={scrollViewRef}
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
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies?.items}
            renderItem={({ item }) => <MovieItem item={item} />}
            estimatedItemSize={240}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MasonryFlashList
            numColumns={2}
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

export default CategoryScreen
