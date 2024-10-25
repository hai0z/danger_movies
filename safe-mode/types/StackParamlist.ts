import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Category } from "../service/MovieService";
import { Item } from ".";

export type RootStackParamList = {
  HomeTab: undefined;
  MovieDetail: { movie: Item };
  Settings: undefined;
  VideoPlayer: {
    movie: Item;
  };
  Category: {
    categoryName: Category;
    title: string;
    slug?: string;
  };
};

export type navigation<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type route<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
