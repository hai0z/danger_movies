import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import VipScreen from "../screens/VipScreen";

const TabNavigation = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Trang chủ",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "search", title: "Tìm kiếm", focusedIcon: "magnify" },
    { key: "discovery", title: "Khám phá", focusedIcon: "earth" },
    { key: "vip", title: "Pro", focusedIcon: "professional-hexagon" },
    {
      key: "favorite",
      title: "Yêu thích",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    search: SearchScreen,
    discovery: DiscoverScreen,
    favorite: FavoriteScreen,
    vip: VipScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default TabNavigation;
