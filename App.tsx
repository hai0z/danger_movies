import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import Navigation from "./navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useAppStore } from "./zustand/appState";
import NavigationSafeMode from "./safe-mode/navigation";

export default function Main() {
  const colorScheme = useAppStore((state) => state.theme);
  const appMode = useAppStore((state) => state.appMode);
  const paperTheme =
    colorScheme === "dark" ? { ...MD3DarkTheme } : { ...MD3LightTheme };

  return (
    <PaperProvider
      theme={paperTheme}
      settings={{
        rippleEffectEnabled: true,
      }}
    >
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          {appMode === "angle" ? <NavigationSafeMode /> : <Navigation />}
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
