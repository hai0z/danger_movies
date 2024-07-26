import { navigation, route } from "../types/StackParamlist";

import * as React from "react";
import {
  View,
  useWindowDimensions,
  Image,
  Dimensions,
  BackHandler,
  Alert,
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

  const [movieId, setMovieId] = React.useState(movie.id);

  const [fullscreen, setFullscreen] = React.useState(false);

  const [isMuted, setIsMuted] = React.useState(true);

  const [loading, setLoading] = React.useState(true);

  const [relatedVideosLoading, setRelatedVideosLoading] = React.useState(true);

  const [title, setTitle] = React.useState<string>(movie.origin_name);

  const [actor, setActor] = React.useState<string[]>(movie.actor);

  const [src, setSrc] = React.useState<string>(
    convertSource(movie.episodes.server_data.Full?.link_embed as string)
  );

  const [relatedVideos, setRelatedVideos] = React.useState<HomeResult>(
    {} as HomeResult
  );

  const navigation = useNavigation<navigation<"VideoPlayer">>();

  const theme = useTheme();

  const hadleChangeVideo = async (
    movieId: number,
    title: string,
    actor: string[],
    link: string
  ) => {
    setMovieId(movieId);
    setTitle(title);
    setActor(actor);
    setSrc(convertSource(link));
    await video.current?.loadAsync(
      {
        uri: convertSource(link),
      },
      {
        shouldPlay: true,
        isMuted: true,
      },
      true
    );
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
        movieId
      );
      setMovieDetail(respone);
      setLoading(false);
    })();
  }, [movieId]);

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
      .then(() => setLoading(false));
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
        <VideoPlayers
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
              uri: src,
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
        />
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
              <Text
                variant="titleMedium"
                numberOfLines={2}
                style={{
                  fontWeight: "bold",
                  paddingHorizontal: 8,
                }}
              >
                {decode(title)}
              </Text>
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
                    extraData={src}
                    estimatedItemSize={120}
                    data={relatedVideos.list}
                    renderItem={({ item }) => (
                      <View key={item?.id}>
                        <TouchableRipple
                          rippleColor={theme.colors.surfaceVariant}
                          onPress={() =>
                            hadleChangeVideo(
                              item?.id,
                              item?.name,
                              item.actor,
                              item.episodes.server_data?.Full
                                ?.link_embed as string
                            )
                          }
                          style={{
                            marginVertical: 4,
                            backgroundColor:
                              src ===
                              convertSource(
                                item?.episodes?.server_data?.Full
                                  ?.link_embed as string
                              )
                                ? theme.colors.primary
                                : "transparent",
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
                              <Text
                                variant="labelLarge"
                                numberOfLines={2}
                                style={{
                                  color:
                                    src ===
                                    convertSource(
                                      item?.episodes?.server_data?.Full
                                        ?.link_embed as string
                                    )
                                      ? theme.colors.onPrimary
                                      : theme.colors.onBackground,
                                }}
                              >
                                {decode(item?.name)}
                              </Text>
                              <Text
                                numberOfLines={2}
                                variant="bodySmall"
                                style={{
                                  textAlign: "justify",
                                  marginTop: 4,
                                  color:
                                    src ===
                                    convertSource(
                                      item?.episodes?.server_data?.Full
                                        ?.link_embed as string
                                    )
                                      ? theme.colors.onPrimary
                                      : theme.colors.onBackground,
                                }}
                              >
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
