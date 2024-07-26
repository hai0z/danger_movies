import { View, ScrollView } from "react-native";
import React from "react";
import { Appbar, Button, Card, Text, useTheme } from "react-native-paper";
import { Category } from "../service/MovieService";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";
import { FlashList } from "@shopify/flash-list";

const DiscoverScreen = () => {
  const theme = useTheme();
  const categery = [
    {
      name: "Ngẫu nhiên 🍅",
      category: Category.random,
      img: "https://c4.wallpaperflare.com/wallpaper/555/231/727/digital-art-fantasy-girl-original-characters-ghostblade-comics-wlop-hd-wallpaper-preview.jpg",
    },
    {
      name: "Mới cập nhật 🔥",
      category: Category.new,
      img: "https://c4.wallpaperflare.com/wallpaper/132/333/162/women-fantasy-girl-fantasy-art-wlop-green-eyes-hd-wallpaper-preview.jpg",
    },
    {
      name: "Không che 🚫",
      category: Category.uncensored,
      img: "https://c4.wallpaperflare.com/wallpaper/659/760/875/wlop-anime-girls-artwork-women-wallpaper-preview.jpg",
    },
    {
      name: "Có che 🔞",
      category: Category.censored,
      img: "https://c4.wallpaperflare.com/wallpaper/857/735/800/wlop-anime-girls-ghost-blade-hd-wallpaper-preview.jpg",
    },
    {
      name: "Không che (Leak) ♨️",
      category: Category.Uncensored_Leaked,
      img: "https://c4.wallpaperflare.com/wallpaper/855/257/291/wlop-ghost-blade-painting-women-wallpaper-preview.jpg",
    },
    {
      name: "China 🇨🇳",
      category: Category.Chinese,
      img: "https://c4.wallpaperflare.com/wallpaper/599/868/6/wlop-ghost-blade-anime-girls-reading-hd-wallpaper-preview.jpg",
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
      <FlashList
        showsVerticalScrollIndicator={false}
        estimatedItemSize={240}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        data={categery}
        renderItem={({ item }) => (
          <View
            style={{ marginBottom: 8, paddingHorizontal: 4, width: "100%" }}
          >
            <Card
              mode="elevated"
              theme={{
                roundness: 2,
              }}
              onPress={() =>
                navigation.navigate("Category", {
                  categoryName: item.category,
                  title: item.name,
                })
              }
            >
              <Card.Cover
                theme={{
                  roundness: 4,
                  isV3: false,
                }}
                source={{
                  uri: item.img,
                }}
              />
              <Card.Content>
                <Text
                  numberOfLines={1}
                  variant="labelLarge"
                  style={{ fontWeight: "bold" }}
                >
                  {item.name}
                </Text>
              </Card.Content>
            </Card>
          </View>
        )}
      />
    </View>
  );
};

export default DiscoverScreen;
