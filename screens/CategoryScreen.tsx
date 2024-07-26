import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  Card,
  useTheme,
  Text,
  ActivityIndicator,
  FAB,
} from "react-native-paper";
import MovieService, { Category } from "../service/MovieService";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { navigation, route } from "../types/StackParamlist";
import { HomeResult, List } from "../types";
import { StatusBar } from "expo-status-bar";
import { decode } from "html-entities";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface Props {
  route: route<"Category">;
}
const CategoryScreen = ({ route }: Props) => {
  const [movies, setMovies] = useState({} as HomeResult);
  const [page, setPage] = useState(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const theme = useTheme();
  const { categoryName, title, keyword } = route.params;

  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<navigation<"HomeTab">>();
  const scrollViewRef = React.useRef<FlashList<List>>(null);

  const getMovies = async () => {
    setLoading(true);
    const respone = await MovieService.getByCategory(
      categoryName,
      page,
      keyword
    );
    setMovies(respone as HomeResult);
    setLoading(false);
  };

  useEffect(() => {
    getMovies();
  }, []);
  const handleLoadMore = async () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
    const respone: HomeResult = await MovieService.getByCategory(
      categoryName,
      page,
      keyword
    );
    console.log(respone.pagecount, page);
    if (respone.pagecount > page) {
      setMovies({
        ...movies,
        list: [...movies.list, ...respone.list],
      });
    }
    setLoadMoreLoading(false);
  };

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
          scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
          getMovies();
        }}
      />

      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} />
      </Appbar.Header>
      {!loading ? (
        <Animated.View
          style={{ flex: 1 }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <MasonryFlashList
            ref={scrollViewRef}
            ListFooterComponent={
              <View>
                {loadMoreLoading && page !== 1 && <ActivityIndicator />}
              </View>
            }
            onEndReached={handleLoadMore}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies?.list}
            renderItem={({ item }) => (
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
                    fadeDuration={200}
                    source={{ uri: item.poster_url }}
                    resizeMode="cover"
                  />
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
            )}
            estimatedItemSize={240}
          />
        </Animated.View>
      ) : (
        <Animated.View style={{ flex: 1 }} exiting={FadeOut.duration(300)}>
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

export default CategoryScreen;
