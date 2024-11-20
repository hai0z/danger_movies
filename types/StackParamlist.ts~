import {RouteProp} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {List} from ".";
import {Category} from "../service/MovieService";
import {Movie} from "../types/movieDetail";

export type RootStackParamList = {
  HomeTab: undefined;
  MovieDetail: { movie: List };
  Settings: undefined;
  VideoPlayer: {
    movie: List;
  };
  Category: {
    categoryName: Category;
    title: string;
    keyword?: string;
  };
  VipPlayer: {
    movie: Movie;
  };
};

export type navigation<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type route<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
