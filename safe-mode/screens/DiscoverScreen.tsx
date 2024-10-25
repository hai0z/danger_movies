import { View, ScrollView } from "react-native";
import React from "react";
import { Appbar, Button, Text, useTheme } from "react-native-paper";
import {
  Category,
  movieGenres,
  countries,
  years,
} from "../service/MovieService";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";

const DiscoverScreen = () => {
  const theme = useTheme();
  const categery = [
    {
      name: "Phim bộ 📀",
      category: Category.phim_bo,
    },
    {
      name: "Phim lẻ 🔥",
      category: Category.phim_le,
    },
    {
      name: "Hoạt hình 🐸",
      category: Category.hoat_hinh,
    },
  ];
  const navigation = useNavigation<navigation<"HomeTab">>();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Appbar.Header>
        <Appbar.Content title="Khám phá" />
      </Appbar.Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={{ margin: 12 }} variant="titleMedium">
            Chung:{" "}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 8,
            }}
          >
            {categery.map((item) => {
              return (
                <Button
                  compact
                  mode="elevated"
                  key={item.name}
                  onPress={() => {
                    navigation.navigate("Category", {
                      categoryName: item.category,
                      title: item.name,
                    });
                  }}
                  style={{
                    margin: 4,
                  }}
                >
                  <Text variant="labelMedium">{item.name}</Text>
                </Button>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={{ margin: 12 }} variant="titleMedium">
            Thể loại:{" "}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 8,
            }}
          >
            {movieGenres.map((item) => {
              return (
                <Button
                  compact
                  mode="elevated"
                  key={item.id}
                  onPress={() => {
                    navigation.navigate("Category", {
                      categoryName: Category.the_loai,
                      title: item.name,
                      slug: item.id,
                    });
                  }}
                  style={{
                    margin: 4,
                  }}
                >
                  <Text variant="labelMedium">{item.name}</Text>
                </Button>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={{ margin: 12 }} variant="titleMedium">
            Quốc gia:{" "}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 8,
            }}
          >
            {countries.map((item) => {
              return (
                <Button
                  compact
                  mode="elevated"
                  key={item.id}
                  onPress={() => {
                    navigation.navigate("Category", {
                      categoryName: Category.quoc_gia,
                      title: item.name,
                      slug: item.id,
                    });
                  }}
                  style={{
                    margin: 4,
                  }}
                >
                  <Text variant="labelMedium">{item.name}</Text>
                </Button>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={{ margin: 12 }} variant="titleMedium">
            Năm phát hành:{" "}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 8,
            }}
          >
            {years.map((item) => {
              return (
                <Button
                  compact
                  mode="elevated"
                  key={item.id}
                  onPress={() => {
                    navigation.navigate("Category", {
                      categoryName: Category.year,
                      title: item.name,
                      slug: item.id,
                    });
                  }}
                  style={{
                    margin: 4,
                  }}
                >
                  <Text variant="labelMedium">{item.name}</Text>
                </Button>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DiscoverScreen;
