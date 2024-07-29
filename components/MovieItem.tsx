import { View } from "react-native";
import React, { memo } from "react";
import { Card, Surface, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/StackParamlist";
import { List } from "../types";
import { decode } from "html-entities";

interface Props {
  item: List;
}
const MovieItem: React.FC<Props> = ({ item }) => {
  const navigation = useNavigation<navigation<"HomeTab">>();
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
          theme={{
            isV3: false,
          }}
          source={{ uri: item.poster_url }}
          fadeDuration={200}
          resizeMode="cover"
        />
        {item.time && (
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
              <Text variant="labelSmall">{item.time}</Text>
            </Surface>
          </View>
        )}
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
  );
};

export default memo(MovieItem);
