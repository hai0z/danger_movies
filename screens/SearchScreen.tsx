import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar, Card, useTheme, Text, Searchbar } from "react-native-paper";
import MovieService from "../service/MovieService";
import { MasonryFlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";
import { StatusBar } from "expo-status-bar";
import { useDebounce } from "../hooks/useDebounce";
import { HomeResult } from "../types";
import { decode } from "html-entities";
import Animated, { FadeIn, FadeInUp, FadeOut } from "react-native-reanimated";
import SkeletonCard from "../components/Skeleton/CardMovieSkeleton";

const SearchScreen = () => {
  const [movies, setMovies] = useState({} as HomeResult);
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigation = useNavigation<navigation<"HomeTab">>();

  const [loading, setLoading] = useState(false);

  const searchVal = useDebounce(searchQuery, 300);
  useEffect(() => {
    if (!searchVal) {
      setMovies({} as HomeResult);
      return;
    }
    const getMovies = async () => {
      setLoading(true);
      setMovies({} as HomeResult);
      const respone = await MovieService.search(searchVal.toLowerCase());
      setMovies(respone);
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
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            data={movies?.list}
            renderItem={({ item }) => (
              <View style={{ width: "100%", paddingHorizontal: 4 }}>
                <Card
                  mode="elevated"
                  theme={{
                    roundness: 2,
                  }}
                  style={{
                    marginVertical: 4,
                    width: "100%",
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
                  />
                  <Card.Content
                    style={{
                      flex: 1,
                    }}
                  >
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
        <Animated.View style={{ flex: 1 }}>
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
