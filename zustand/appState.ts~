import {Movie} from "./../safe-mode/types/movieDetail";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import zustandStorage from "./storage";
import {List} from "../types";
import {Movie as VipMovie} from "../types/movieDetail";

interface AppStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  viewType: "list" | "grid";
  setViewType: (viewType: "list" | "grid") => void;
  likeVideos: List[];
  setLikeVideos: (likeVideos: List[]) => void;
  appMode: "angle" | "devil";
  setAppMode: (appMode: "angle" | "devil") => void;
  likedAnglesMovies: Movie[];
  setLikedAnglesMovies: (likedAngles: Movie[]) => void;
  VipMovie: VipMovie[];
  setVipMovie: (VipMovie: VipMovie[]) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      viewType: "grid",
      setViewType: (viewType) => set({ viewType }),
      likeVideos: [],
      setLikeVideos: (likeVideos) => set({ likeVideos }),
      appMode: "angle",
      setAppMode: (appMode) => set({ appMode }),
      likedAnglesMovies: [],
      setLikedAnglesMovies: (likedAnglesMovies) => set({ likedAnglesMovies }),
      VipMovie: [],
      setVipMovie: (VipMovie) => set({ VipMovie }),
    }),
    {
      name: "app-state",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
