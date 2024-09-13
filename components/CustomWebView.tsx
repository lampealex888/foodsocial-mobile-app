import { useRef } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import { ALLOWED_DOMAINS } from "@/constants";

const webViewRef = useRef<WebView>(null);

const handleNavigationStateChange = (newNavState: { url: any }) => {
  const { url } = newNavState;
  if (!isUrlAllowed(url)) {
    Alert.alert("External Link", "You are about to leave FoodSocial. Do you want to continue?", [
      {
        text: "Stay on FoodSocial",
        onPress: () => {
          if (webViewRef.current) webViewRef.current.goBack();
        },
      },
      { text: "Leave", onPress: () => {} },
    ]);
  }
};

const isUrlAllowed = (url: string | URL) => {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.some((domain) => hostname.includes(domain));
  } catch {
    return false;
  }
};

const handleShouldStartLoadWithRequest = (request: { url: string | URL }) => {
  return isUrlAllowed(request.url);
};

export default function CustomWebView({ uriParam }: { uriParam?: string }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <WebView
        ref={webViewRef}
        style={{ flex: 1 }}
        source={{ uri: "https://foodsocial.io/" }}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onOpenWindow={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          const { targetUrl } = nativeEvent;
          console.log("Intercepted OpenWindow for", targetUrl);
          if (!isUrlAllowed(targetUrl)) {
            Alert.alert("External Link", "You are about to leave FoodSocial. Do you want to continue?", [
              { text: "Stay on FoodSocial", onPress: () => {} },
              { text: "Leave", onPress: () => {} },
            ]);
            return false;
          }
          return true;
        }}
      />
    </SafeAreaView>
  );
}
