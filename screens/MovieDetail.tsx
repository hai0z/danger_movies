import { View, Image, ScrollView, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import {
  useTheme,
  Text,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { navigation, route } from "../types/StackParamlist";
import { useNavigation } from "@react-navigation/native";
import MovieService, { Category } from "../service/MovieService";
import { MovieDetailResult } from "../types/movieDetail";

interface Props {
  route: route<"MovieDetail">;
}
const MovieDetail = ({ route }: Props) => {
  const { movie } = route.params;
  const theme = useTheme();
  const navigation = useNavigation<navigation<"MovieDetail">>();

  const [loading, setLoading] = useState(true);

  const { width, height } = useWindowDimensions();
  const [movieDetail, setMovieDetail] = useState<MovieDetailResult>(
    {} as MovieDetailResult
  );

  useEffect(() => {
    (async () => {
      const respone = await MovieService.getMovieDetail(movie.id);
      setMovieDetail(respone);
      setLoading(false);
    })();
  }, []);
  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size={"small"} />
      </View>
    );
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Image
        source={{ uri: movieDetail?.list?.[0].thumb_url }}
        style={{
          width: width,
          height: width * (9 / 16),
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode="cover"
      />
      <IconButton
        icon={"arrow-left"}
        style={{
          position: "absolute",
          top: 20,
          left: 10,
          zIndex: 99,
          backgroundColor: theme.colors.surfaceVariant,
        }}
        onPress={() => navigation.goBack()}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            top: width * (9 / 16) - 30,
            paddingTop: 20,
            zIndex: 99,
            backgroundColor: theme.colors.background,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            width: "100%",
          }}
        >
          <Text
            numberOfLines={2}
            variant="bodySmall"
            style={{
              fontWeight: "bold",
              marginBottom: 16,
              marginHorizontal: 8,
            }}
          >
            {movie?.name}
          </Text>

          <Divider
            style={{ backgroundColor: theme.colors.onSurfaceDisabled }}
          />
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: theme.colors.background,
            top: width * (9 / 16),
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 10,
            flex: 1,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            elevation: 5,
            paddingTop: 50,
          }}
        >
          <View style={{ paddingHorizontal: 8, width: "100%" }}>
            <Text
              variant="bodyMedium"
              style={{ fontWeight: "bold", marginBottom: 4 }}
            >
              Trạng thái
            </Text>
            <Text>Thể loại: {movieDetail?.list?.[0]?.type_name}</Text>
            <Text>Quốc gia: {movieDetail?.list?.[0]?.country}</Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Text>Diễn viên: </Text>
              {movieDetail?.list?.[0]?.actor.map((item) => (
                <Button
                  mode="text"
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
                  {item}
                </Button>
              ))}
            </View>
            <Text>Năm: {movieDetail?.list?.[0]?.year}</Text>
            <Text>Code: {movieDetail?.list?.[0]?.movie_code}</Text>
            <Text>Thời lượng: {movieDetail?.list?.[0]?.time}</Text>
            <View></View>
          </View>
          <View style={{ paddingHorizontal: 8, marginTop: 20 }}>
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
              {movieDetail?.list?.[0]?.category?.map((item) => (
                <Chip
                  onPress={() =>
                    navigation.navigate("Category", {
                      categoryName: Category.other,
                      title: item,
                      keyword: item,
                    })
                  }
                  key={item}
                >
                  {item}
                </Chip>
              ))}
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text
              variant="bodyLarge"
              style={{
                fontWeight: "bold",
                paddingHorizontal: 8,
                marginBottom: 4,
              }}
            >
              Các tập
            </Text>
            <View
              style={{
                marginVertical: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: movieDetail?.list?.[0]?.thumb_url }}
                  style={{
                    width: 75,
                    height: 100,
                    borderRadius: 6,
                    marginLeft: 8,
                  }}
                />
                <View style={{ marginLeft: 8, flex: 1, marginRight: 8 }}>
                  <Text variant="titleSmall" numberOfLines={2}>
                    {movieDetail?.list?.[0]?.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{
                      textAlign: "justify",
                    }}
                  >
                    {movieDetail?.list?.[0]?.episodes?.server_data?.Full?.slug}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Button
            style={{ marginTop: 8, marginHorizontal: 8 }}
            mode="contained"
            // onPress={() =>
            //   navigation.push("VideoPlayer", {
            //     videoSource:
            //       movieDetail?.list?.[0]?.episodes?.server_data?.Full
            //         ?.link_embed,
            //     movie: movieDetail.list[0],
            //     episode: "",
            //   })
            // }
          >
            Xem Ngay
          </Button>
          <View style={{ height: 300, width: "100%" }} />
        </ScrollView>
      </View>
    </View>
  );
};

export default MovieDetail;
