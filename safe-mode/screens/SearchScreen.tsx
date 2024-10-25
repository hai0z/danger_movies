import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  useTheme,
  Searchbar,
  ActivityIndicator,
} from "react-native-paper";
import MovieService from "../service/MovieService";
import { MasonryFlashList } from "@shopify/flash-list";
import { useDebounce } from "../../hooks/useDebounce";
import Animated from "react-native-reanimated";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";
import MovieItem from "../components/MovieItem";
import { SearchResult } from "../types/searchResult";
import { HomeResult } from "../types";

const SearchScreen = () => {
  const [movies, setMovies] = useState({} as HomeResult);

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = React.useState("");

  const [loading, setLoading] = useState(false);

  const searchVal = useDebounce(searchQuery, 300);

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const [page, setPage] = useState(1);

  const handleLoadMore = async (currentPage: number) => {
    if (page >= movies.paginate?.total_page || movies.items.length === 0)
      return;
    setLoadMoreLoading(true);
    setPage(currentPage);
    const respone = await MovieService.search(
      searchQuery.toLowerCase(),
      currentPage
    );
    setMovies({
      ...movies,
      items: [...movies.items, ...respone.items],
    });
    setLoadMoreLoading(false);
  };

  useEffect(() => {
    if (!searchVal) {
      setMovies({} as HomeResult);
      setPage(1);
      return;
    }
    const getMovies = async () => {
      setLoading(true);
      setMovies({} as HomeResult);
      const respone = await MovieService.search(searchVal.toLowerCase(), 1);
      setMovies(respone);
      setLoading(false);
    };
    if (searchVal && searchVal.length > 0) {
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
        placeholder="Nhập tên phim..."
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
            onEndReached={() => handleLoadMore(page + 1)}
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
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies?.items}
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
