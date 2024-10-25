import { navigation, route } from "../types/StackParamlist";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as React from "react";
import { View, useWindowDimensions, Image, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Chip, Divider, useTheme } from "react-native-paper";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { HomeResult } from "../types";
import MovieService, { Category } from "../service/MovieService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MovieDetailResult } from "../types/movieDetail";
import SkeletonLoading from "../components/Skeleton/SkeletonLoading";
import { useKeepAwake } from "expo-keep-awake";
import {
  GestureHandlerRootView,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import slugify from "slugify";
import WebView from "react-native-webview";
import { useAppStore } from "../../zustand/appState";
import { decode } from "html-entities";
import dayjs from "dayjs";

interface Props {
  route: route<"VideoPlayer">;
}

export default function VideoPlayer() {
  useKeepAwake();
  const { width } = useWindowDimensions();

  const route = useRoute<Props["route"]>();

  const { movie } = route.params;

  const [movieDetail, setMovieDetail] = React.useState<MovieDetailResult>(
    {} as MovieDetailResult
  );
  const [relatedMovies, setRelatedMovies] = React.useState<HomeResult>();

  const [loading, setLoading] = React.useState(true);

  const [actor, setActor] = React.useState<string[]>();

  const [currentEp, setCurrentEp] = React.useState(
    {} as MovieDetailResult["movie"]["episodes"][0]["items"][0]
  );

  const likedVideos = useAppStore((state) => state.likedAnglesMovies);

  const navigation = useNavigation<navigation<"VideoPlayer">>();

  const theme = useTheme();

  const toggleLike = () => {
    if (likedVideos.findIndex((item) => item.slug === movie.slug) !== -1) {
      useAppStore
        .getState()
        .setLikedAnglesMovies(
          likedVideos.filter((item) => item.slug !== movie.slug)
        );
      ToastAndroid.show("Đã xoá khỏi yêu thích", ToastAndroid.SHORT);
    } else {
      useAppStore
        .getState()
        .setLikedAnglesMovies([movieDetail?.movie, ...likedVideos]);
      ToastAndroid.show("Đã thêm vào yêu thích", ToastAndroid.SHORT);
    }
  };
  const handleChangeEp = (
    ep: MovieDetailResult["movie"]["episodes"][0]["items"][0]
  ) => {
    setCurrentEp(ep);
  };

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      const [respone, relatedMovies] = await Promise.all([
        MovieService.getMovieDetail(movie.slug),
        MovieService.getRandomVideo(),
      ]);
      setMovieDetail(respone);
      setActor(respone.movie.casts);
      setCurrentEp(respone?.movie?.episodes?.[0]?.items?.[0]);
      setRelatedMovies(relatedMovies);
      setLoading(false);
    })();
  }, [movie.slug]);

  return (
    <GestureHandlerRootView>
      <StatusBar style="light" />
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            width,
            height: width * (9 / 16),
          }}
        >
          <WebView
            style={{
              backgroundColor: "#000",
            }}
            javaScriptEnabled
            scrollEnabled={false}
            allowsFullscreenVideo={true}
            source={{
              uri: currentEp?.embed,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            paddingTop: 8,
            backgroundColor: theme.colors.background,
          }}
        >
          {loading ? (
            <View
              style={{
                paddingHorizontal: 8,
                marginBottom: 8,
              }}
            >
              <SkeletonLoading width={"100%"} />
              <SkeletonLoading width={"100%"} />
              <SkeletonLoading width={"75%"} />
              <View>
                <SkeletonLoading width={"100%"} height={200} />
                <SkeletonLoading width={"100%"} height={150} />
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {Array.from(Array(3).keys()).map((item) => (
                  <View style={{ flex: 1 }} key={item}>
                    <SkeletonLoading width={"100%"} height={160} />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 8,
                  marginBottom: 8,
                }}
              >
                <Text
                  variant="titleMedium"
                  numberOfLines={2}
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  {movie.name} - Tập {currentEp?.name}
                </Text>
                <TouchableOpacity onPress={toggleLike} style={{ padding: 4 }}>
                  <MaterialCommunityIcons
                    name={
                      likedVideos.findIndex(
                        (item) => item.slug === movie.slug
                      ) > -1
                        ? "heart"
                        : "heart-outline"
                    }
                    size={32}
                    color={
                      likedVideos.findIndex(
                        (item) => item.slug === movie.slug
                      ) > -1
                        ? "red"
                        : theme.colors.onSurface
                    }
                  />
                </TouchableOpacity>
              </View>
              <Divider />
              {/* <Divider /> */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    paddingHorizontal: 8,
                    marginTop: 4,
                  }}
                >
                  <Text>Diễn viên: {actor} </Text>
                </View>

                <View style={{ width: "100%", gap: 4, paddingHorizontal: 8 }}>
                  <Text>Chất lượng: {movieDetail?.movie?.quality}</Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>Quốc gia: </Text>
                    {movieDetail?.movie?.category["4"]["list"].map(
                      (item, index) => (
                        <TouchableOpacity
                          key={item.name}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          onPress={() => {
                            navigation.push("Category", {
                              categoryName: Category.quoc_gia,
                              title: item.name,
                              slug: slugify(item.name, {
                                locale: "vi",
                                replacement: "-",
                                lower: true,
                              }),
                            });
                          }}
                        >
                          <Text style={{ color: theme.colors.primary }}>
                            {`${item.name}`}
                            {index <
                            movieDetail?.movie?.category["4"]["list"].length - 1
                              ? ", "
                              : ""}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  <Text>
                    Ngày phát hành:{" "}
                    {dayjs(movieDetail?.movie?.created).format("DD/MM/YYYY")}
                  </Text>
                  <Text>
                    Trạng thái: {movieDetail?.movie?.current_episode} (
                    {movieDetail?.movie?.total_episodes} tập)
                  </Text>
                  {movieDetail?.movie?.time && (
                    <Text>Thời lượng: {movieDetail?.movie?.time}</Text>
                  )}

                  <Text>
                    Nội dung: {decode(movieDetail?.movie?.description)}
                  </Text>
                </View>
                <View style={{ marginTop: 8, paddingHorizontal: 8 }}>
                  <Text
                    variant="bodyLarge"
                    style={{ fontWeight: "bold", marginBottom: 4 }}
                  >
                    Danh mục
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {movieDetail?.movie?.category["2"]["list"]?.map((item) => (
                      <Chip
                        compact
                        mode="flat"
                        key={item.id}
                        onPress={() => {
                          navigation.push("Category", {
                            categoryName: Category.the_loai,
                            title: item.name,
                            slug: slugify(item.name, {
                              locale: "vi",
                              replacement: "-",
                              lower: true,
                            }),
                          });
                        }}
                      >
                        {item.name}
                      </Chip>
                    ))}
                  </View>
                </View>
                <View>
                  <Text
                    variant="bodyLarge"
                    style={{
                      fontWeight: "bold",
                      marginTop: 8,
                      paddingHorizontal: 8,
                    }}
                  >
                    Các tập
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      gap: 4,
                    }}
                  >
                    {movieDetail?.movie?.episodes?.map((item) => (
                      <View key={item.server_name} style={{ marginTop: 8 }}>
                        <Text
                          style={{
                            marginBottom: 8,
                          }}
                        >
                          {item.server_name}
                        </Text>
                        <View
                          style={{
                            gap: 4,
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          {item?.items?.map((ep) => (
                            <Button
                              onPress={() => {
                                handleChangeEp(ep);
                              }}
                              mode={
                                currentEp?.embed === ep.embed
                                  ? "contained"
                                  : "contained-tonal"
                              }
                              compact
                              labelStyle={{ fontSize: 12 }}
                              key={ep.embed}
                              style={{
                                width:
                                  movieDetail?.movie?.total_episodes > 1
                                    ? 40
                                    : 60,
                              }}
                            >
                              {ep.name}
                            </Button>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                <View>
                  <Text
                    variant="bodyLarge"
                    style={{
                      fontWeight: "bold",
                      marginTop: 8,
                      paddingHorizontal: 8,
                    }}
                  >
                    Có thể bạn thích
                  </Text>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                    style={{
                      marginTop: 8,
                      flexDirection: "row",
                      paddingBottom: 80,
                    }}
                  >
                    {relatedMovies?.items?.map((item) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.navigate("VideoPlayer", { movie: item });
                        }}
                        key={item?.slug}
                        style={{ marginRight: 8, width: 128 }}
                      >
                        <Image
                          source={{
                            uri:
                              JSON.stringify(item?.thumb_url) === "{}"
                                ? ""
                                : item?.thumb_url,
                          }}
                          style={{
                            width: 128,
                            borderRadius: 4,
                            aspectRatio: 3 / 4,
                          }}
                        />
                        <View>
                          <Text variant="labelMedium" numberOfLines={2}>
                            {item?.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
