import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  Card,
  useTheme,
  Text,
  Searchbar,
  ActivityIndicator,
} from "react-native-paper";
import MovieService from "../service/MovieService";
import { MasonryFlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";
import { useDebounce } from "../hooks/useDebounce";
import { HomeResult } from "../types";
import Animated from "react-native-reanimated";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";
import MovieItem from "../components/MovieItem";

const SearchScreen = () => {
  const [movies, setMovies] = useState({} as HomeResult);

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = React.useState("");

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const searchVal = useDebounce(searchQuery, 300);

  const handleLoadMore = async () => {
    if (page >= movies.pagecount) return;
    setLoadMoreLoading(true);
    setPage(page + 1);
    const respone: HomeResult = await MovieService.search(
      `${searchVal.toLowerCase()}&pg=${page}`
    );
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
    if (!searchVal) {
      setMovies({} as HomeResult);
      setPage(1);
      setLoadMoreLoading(false);
      return;
    }
    const getMovies = async () => {
      setLoading(true);
      setMovies({} as HomeResult);
      const respone: HomeResult = await MovieService.search(
        searchVal.toLowerCase()
      );
      setMovies({
        ...respone,
        list: Array.from(
          new Map(respone.list.map((item) => [item.movie_code, item])).values()
        ),
      });
      setLoading(false);
    };
    if (searchVal) {
      getMovies();
    }
  }, [searchVal]);
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Tìm kiếm" />
      </Appbar.Header>
      <Searchbar
        mode="bar"
        placeholder="Nhập tên phim, code, ..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          marginHorizontal: 8,
        }}
        loading={false}
      />
      {!loading ? (
        <Animated.View style={{ flex: 1, paddingTop: 8 }}>
          <MasonryFlashList
            ListFooterComponent={
              <View>
                {loadMoreLoading && page !== 1 && searchQuery && (
                  <ActivityIndicator />
                )}
              </View>
            }
            onEndReached={handleLoadMore}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies?.list}
            renderItem={({ item }) => <MovieItem item={item} />}
            estimatedItemSize={240}
          />
        </Animated.View>
      ) : (
        <Animated.View style={{ flex: 1, paddingTop: 8 }}>
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
        </Animated.View>
      )}
    </View>
  );
};

export default SearchScreen;
