import {navigation, route} from "../types/StackParamlist";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as React from "react";
import {Image, ToastAndroid, useWindowDimensions, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Divider, Text, TouchableRipple, useTheme} from "react-native-paper";
import {StatusBar} from "expo-status-bar";
import {HomeResult} from "../types";
import MovieService from "../service/MovieService";
import {useNavigation, useRoute} from "@react-navigation/native";
import SkeletonLoading from "../components/Skeleton/SkeletonLoading";
import {useKeepAwake} from "expo-keep-awake";
import {GestureHandlerRootView, TouchableOpacity,} from "react-native-gesture-handler";
import SkeletonMovieItem from "../components/Skeleton/SkeletonMovieItem";
import {FlashList} from "@shopify/flash-list";
import {decode} from "html-entities";
import WebView from "react-native-webview";
import {useAppStore} from "../zustand/appState";
import {MovieDetailRespone} from "../service/MovieType";
import ApiService from "../service/VipService";

interface Props {
  route: route<"VipPlayer">;
}

export default function VipDetail() {
  useKeepAwake();
  const { width } = useWindowDimensions();

  const route = useRoute<Props["route"]>();

  const { movie } = route.params;

  // const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [_, setMovieDetail] = React.useState<MovieDetailRespone>(
    {} as MovieDetailRespone
  );

  const [loading, setLoading] = React.useState(true);

  const [relatedVideosLoading, setRelatedVideosLoading] = React.useState(true);

  const [title, setTitle] = React.useState<string>(movie.name);

  const [actor, setActor] = React.useState<string[]>(movie.actors);

  const [relatedVideos, setRelatedVideos] = React.useState<HomeResult>(
    {} as HomeResult
  );

  const likedVideos = useAppStore((state) => state.VipMovie);

  const navigation = useNavigation<navigation<"VideoPlayer">>();

  const theme = useTheme();

  const toggleLike = () => {
    if (likedVideos.includes(movie)) {
      useAppStore
        .getState()
        .setVipMovie(likedVideos.filter((item) => item !== movie));
      ToastAndroid.show("Đã xoá khỏi yêu thích", ToastAndroid.SHORT);
    } else {
      useAppStore.getState().setVipMovie([movie, ...likedVideos]);
      ToastAndroid.show("Đã thêm vào yêu thích", ToastAndroid.SHORT);
    }
  };
  React.useEffect(() => {
    const getRelatedVideos = async () => {
      setRelatedVideosLoading(true);
      const respone = await MovieService.getRandomVideo();
      setRelatedVideos(respone);
      setRelatedVideosLoading(false);
    };
    getRelatedVideos();
  }, [route.params.movie.id]);

  React.useEffect(() => {
    (async () => {
      const respone: MovieDetailRespone = await ApiService.getMoiveDetail(
        movie.slug
      );
      setMovieDetail(respone);
      setLoading(false);
    })();
  }, [movie.id]);

  React.useEffect(() => {
    setLoading(true);
    setTitle(movie.name);
    setActor(movie.actors);
  }, [route.params.movie.id]);

  return (
    <GestureHandlerRootView>
      <StatusBar style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000000",
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
              uri: movie.episodes?.[0]?.server_data?.[0]?.link,
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
            </View>
          ) : (
                     <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 8,
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
                  {decode(title)}
                </Text>
                <TouchableOpacity onPress={toggleLike} style={{ padding: 4 }}>
                  <MaterialCommunityIcons
                    name={
                      likedVideos.includes(movie) ? "heart" : "heart-outline"
                    }
                    size={32}
                    color={
                      likedVideos.includes(movie)
                        ? "red"
                        : theme.colors.onSurface
                    }
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  marginBottom: 16,
                  marginTop: 4,
                }}
              >
                <Text>Diễn viên: </Text>
                {actor?.slice(0, 3).map((item) => (
                  <Text key={item}>
                    <Text
                      style={{
                        color:
                          item === "Updating"
                            ? theme.colors.onSurfaceDisabled
                            : theme.colors.primary,
                      }}
                    >
                      {item}
                      {", "}
                    </Text>
                  </Text>
                ))}
              </View>
            </View>
          )}
          <Divider />
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              {relatedVideosLoading ? (
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonMovieItem key={index} />
                  ))}
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <FlashList
                    estimatedItemSize={120}
                    data={relatedVideos.list.slice(0, 100)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableRipple
                          rippleColor={theme.colors.surfaceVariant}
                          onPress={() =>
                            navigation.navigate("VideoPlayer", {
                              movie: item,
                            })
                          }
                          style={{
                            marginVertical: 4,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 8,
                            }}
                          >
                            <Image
                              source={{ uri: item?.poster_url }}
                              style={{
                                width: 75,
                                height: 100,
                                borderRadius: 4,
                                marginLeft: 8,
                              }}
                            />
                            <View
                              style={{ marginLeft: 8, flex: 1, marginRight: 8 }}
                            >
                              <Text variant="labelLarge" numberOfLines={2}>
                                {decode(item?.name)}
                              </Text>
                              <Text numberOfLines={2} variant="bodySmall">
                                {item?.episodes?.server_name} {" - "}
                                {item?.episodes?.server_data?.Full?.slug}
                              </Text>
                            </View>
                          </View>
                        </TouchableRipple>
                        <Divider />
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
