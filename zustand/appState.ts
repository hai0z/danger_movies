import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "./storage";
import { List } from "../types";

interface AppStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  viewType: "list" | "grid";
  setViewType: (viewType: "list" | "grid") => void;
  likeVideos: List[];
  setLikeVideos: (likeVideos: List[]) => void;
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
    }),
    {
      name: "app-state",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
