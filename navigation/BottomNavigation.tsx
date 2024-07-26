import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import MovieDetail from "../screens/MovieDetail";
import SearchScreen from "../screens/SearchScreen";
import DiscoverScreen from "../screens/DiscoverScreen";

const TabNavigation = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "music",
      title: "Trang chủ",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },

    { key: "search", title: "Tìm kiếm", focusedIcon: "magnify" },
    { key: "discovery", title: "Khám phá", focusedIcon: "earth" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: HomeScreen,
    search: SearchScreen,
    discovery: DiscoverScreen,
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
