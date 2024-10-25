import { View } from "react-native";
import React, { memo } from "react";
import { Card, Surface, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";
import { decode } from "html-entities";
import { Item } from "../types";
import { useAppStore } from "../../zustand/appState";

interface Props {
  item: Item;
}
const MovieItem: React.FC<Props> = ({ item }) => {
  const navigation = useNavigation<navigation<"HomeTab">>();
  const viewType = useAppStore((state) => state.viewType);
  const theme = useTheme();
  console.log(item.poster_url);
  return (
    <View style={{ width: "100%", paddingHorizontal: 4 }}>
      <Card
        theme={{
          roundness: 2,
        }}
        mode="elevated"
        style={{
          marginVertical: 4,
        }}
        onPress={() => navigation.navigate("VideoPlayer", { movie: item })}
      >
        <Card.Cover
          style={{
            backgroundColor: theme.colors.surfaceDisabled,
            height: viewType === "grid" ? 120 : 200,
          }}
          theme={{
            isV3: false,
          }}
          source={{
            uri:
              JSON.stringify(item?.thumb_url) === "{}" ? "" : item?.poster_url,
          }}
          resizeMode="cover"
        />

        <View style={{ position: "absolute", top: 5, left: 5 }}>
          <Surface
            elevation={5}
            style={{
              borderRadius: 3,
              padding: 2,
              opacity: 0.85,
            }}
            mode="elevated"
          >
            <Text variant="labelSmall">{item.quality}</Text>
          </Surface>
        </View>
        {item.language && (
          <View style={{ position: "absolute", bottom: 55, right: 5 }}>
            <Surface
              elevation={5}
              style={{
                borderRadius: 3,
                padding: 2,
                opacity: 0.85,
              }}
              mode="elevated"
            >
              <Text variant="labelSmall">{item.language}</Text>
            </Surface>
          </View>
        )}
        <Card.Content>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: "bold",
            }}
            variant="labelMedium"
            lineBreakMode="middle"
          >
            {decode(item.name)}
          </Text>
          <Text numberOfLines={1} variant="labelSmall">
            {decode(item.original_name)}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default memo(MovieItem);
