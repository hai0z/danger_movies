import { View } from "react-native"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Appbar, FAB, useTheme } from "react-native-paper"
import MovieService, { Category } from "../service/MovieService"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import { useNavigation } from "@react-navigation/native"
import { navigation, route } from "../types/StackParamlist"
import { HomeResult, List } from "../types"
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
  const { categoryName, title, keyword } = route.params

  const [loading, setLoading] = useState(true)

  const navigation = useNavigation<navigation<"HomeTab">>()
  const scrollViewRef = React.useRef<FlashList<List>>(null)

  const getMovies = async () => {
    setLoading(true)
    const respone: HomeResult = await MovieService.getByCategory(
      categoryName,
      page,
      keyword
    )
    setMovies({
      ...respone,
      list: Array.from(
        new Map(respone.list.map((item) => [item.movie_code, item])).values()
      ),
    })
    setLoading(false)
  }

  useEffect(() => {
    getMovies()
  }, [route.params])

  const handleLoadMore = async (currentPage: number) => {
    if (page >= movies.pagecount) return
    setLoadMoreLoading(true)
    setPage(currentPage)
    const respone: HomeResult = await MovieService.getByCategory(
      categoryName,
      page,
      keyword
    )
    console.log(respone.pagecount, page)
    if (respone.pagecount > page) {
      setMovies({
        ...movies,
        list: [
          ...movies.list,
          ...Array.from(
            new Map(
              respone.list.map((item) => [item.movie_code, item])
            ).values()
          ),
        ],
      })
    }
    setLoadMoreLoading(false)
  }

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <FAB
        visible={categoryName === Category.random}
        icon="refresh"
        disabled={loading}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 48,
          zIndex: 999,
        }}
        onPress={() => {
          scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true })
          getMovies()
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
            data={movies?.list}
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
