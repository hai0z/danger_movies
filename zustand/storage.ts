import { StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
const zustandStorage: StateStorage = {
  getItem(name) {
    const value = AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem(name, value) {
    AsyncStorage.setItem(name, value);
  },
  removeItem(name) {
    AsyncStorage.removeItem(name);
  },
};

export default zustandStorage;
