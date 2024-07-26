import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import Navigation from "./navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useAppStore } from "./zustand/appState";

export default function Main() {
  const colorScheme = useAppStore((state) => state.theme);
  console.log(colorScheme);
  const { theme } = useMaterial3Theme();
  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <PaperProvider theme={paperTheme}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Navigation />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
