import { navigation, route } from "../types/StackParamlist";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as React from "react";
import {
  View,
  useWindowDimensions,
  Image,
  Dimensions,
  BackHandler,
  Alert,
  ToastAndroid,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, TouchableRipple, useTheme } from "react-native-paper";
import { Text } from "react-native-paper";
import * as ExpoOrientation from "expo-screen-orientation";
import VideoPlayers from "../components/VideoPlayer/";
import { setStatusBarHidden, StatusBar } from "expo-status-bar";
import { HomeResult } from "../types";
import MovieService, { Category } from "../service/MovieService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MovieDetailResult } from "../types/movieDetail";
import MovieDetailModal from "../components/MovieDetailModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SkeletonLoading from "../components/Skeleton/SkeletonLoading";
import { useKeepAwake } from "expo-keep-awake";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import SkeletonMovieItem from "../components/Skeleton/SkeletonMovieItem";
import { FlashList } from "@shopify/flash-list";
import { decode } from "html-entities";
import { defaultProps } from "expo-video-player/dist/props";
import WebView from "react-native-webview";
import { useAppStore } from "../zustand/appState";

const convertSource = (source: string) => {
  return source?.replace("https://avdbapi.com/player/?s=", "");
};

interface Props {
  route: route<"VideoPlayer">;
}

export default function VideoPlayer() {
  useKeepAwake();
  const { width } = useWindowDimensions();

  const video = React.useRef<Video>(null);

  const route = useRoute<Props["route"]>();

  const { movie } = route.params;

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const [movieDetail, setMovieDetail] = React.useState<MovieDetailResult>(
    {} as MovieDetailResult
  );

  const [fullscreen, setFullscreen] = React.useState(false);

  const [isMuted, setIsMuted] = React.useState(true);

  const [loading, setLoading] = React.useState(true);

  const [relatedVideosLoading, setRelatedVideosLoading] = React.useState(true);

  const [title, setTitle] = React.useState<string>(movie.origin_name);

  const [actor, setActor] = React.useState<string[]>(movie.actor);

  const [relatedVideos, setRelatedVideos] = React.useState<HomeResult>(
    {} as HomeResult
  );

  const likedVideos = useAppStore((state) => state.likeVideos);

  const navigation = useNavigation<navigation<"VideoPlayer">>();

  const theme = useTheme();

  const toggleLike = () => {
    if (likedVideos.includes(movie)) {
      useAppStore
        .getState()
        .setLikeVideos(likedVideos.filter((item) => item !== movie));
      ToastAndroid.show("Đã xoá khỏi yêu thích", ToastAndroid.SHORT);
    } else {
      useAppStore.getState().setLikeVideos([...likedVideos, movie]);
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
    return () => {
      video.current?.unloadAsync();
    };
  }, [route.params.movie.id]);

  React.useEffect(() => {
    (async () => {
      const respone: MovieDetailResult = await MovieService.getMovieDetail(
        movie.id
      );
      setMovieDetail(respone);
      setLoading(false);
    })();
  }, [movie.id]);

  React.useEffect(() => {
    setLoading(true);
    setTitle(movie.origin_name);
    setActor(movie.actor);
    video.current
      ?.loadAsync(
        {
          uri: convertSource(
            movie.episodes.server_data.Full?.link_embed as string
          ),
        },
        {
          shouldPlay: true,
          isMuted: true,
        },
        true
      )
      .then(() => setLoading(false))
      .catch(() => Alert.alert("Lỗi", "Không thể phát video này"));
  }, [route.params.movie.id]);

  React.useEffect(() => {
    const handleBackPress = () => {
      if (fullscreen) {
        ExpoOrientation.lockAsync(ExpoOrientation.OrientationLock.PORTRAIT);
        setFullscreen(false);
        setStatusBarHidden(false, "fade");
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [fullscreen, setFullscreen]);

  return (
    <GestureHandlerRootView>
      <StatusBar style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000000",
        }}
      >
        {/* <VideoPlayers
          {...defaultProps}
          autoHidePlayer={false}
          errorCallback={() => Alert.alert("Lỗi", "Không thể phát video này")}
          fullscreen={{
            inFullscreen: fullscreen,
            enterFullscreen: async function () {
              setStatusBarHidden(true, "fade");
              await ExpoOrientation.lockAsync(
                ExpoOrientation.OrientationLock.LANDSCAPE
              );
              setFullscreen(true);
            },
            exitFullscreen: async function () {
              setStatusBarHidden(false, "fade");
              await ExpoOrientation.lockAsync(
                ExpoOrientation.OrientationLock.DEFAULT
              );
              setFullscreen(false);
            },
          }}
          timeVisible={true}
          slider={{
            thumbTintColor: theme.colors.primary,
            minimumTrackTintColor: theme.colors.secondary,
            maximumTrackTintColor: theme.colors.surfaceVariant,
          }}
          mute={{
            visible: true,
            enterMute: async function () {
              setIsMuted(true);
            },
            exitMute: async function () {
              setIsMuted(false);
            },
            isMute: isMuted,
          }}
          videoProps={{
            ref: video as any,
            shouldPlay: true,
            resizeMode: ResizeMode.CONTAIN,
            source: {
              uri: convertSource(
                movie.episodes.server_data.Full?.link_embed as string
              ),
            },
            posterSource: {
              uri: movie.poster_url,
            },
            posterStyle: {
              resizeMode: "cover",
              width,
              height: width * (9 / 16),
            },
            usePoster: true,
            isMuted: isMuted,
          }}
          style={{
            videoBackgroundColor: "black",
            height: fullscreen
              ? Dimensions.get("window").height
              : width * (9 / 16),
            width: fullscreen ? Dimensions.get("window").width : width,
          }}
        /> */}
        <View
          style={{
            width,
            height: width * (9 / 16),
          }}
        >
          <WebView
            javaScriptEnabled
            scrollEnabled={false}
            allowsFullscreenVideo={true}
            source={{
              uri: movie.episodes.server_data.Full?.link_embed as string,
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
                <TouchableOpacity onPress={toggleLike}>
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
                  <TouchableOpacity
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    key={item}
                    disabled={item === "Updating"}
                    onPress={() => {
                      navigation.push("Category", {
                        categoryName: Category.other,
                        title: item,
                        keyword: item,
                      });
                    }}
                  >
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
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => bottomSheetModalRef.current?.present()}
                >
                  <Text style={{ color: theme.colors.secondary }}>
                    xem thêm
                  </Text>
                </TouchableOpacity>
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
                    data={relatedVideos.list}
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
        <MovieDetailModal
          handleClose={() => bottomSheetModalRef.current?.dismiss()}
          movie={movieDetail?.list?.[0]}
          ref={bottomSheetModalRef}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
