import { forwardRef } from "react";
import type { WebViewSharedProps } from "react-native-webview/lib/WebViewTypes";

export type PlatformWebViewHandle = {
  goBack: () => void;
  reload: () => void;
};

export function isPlatformWebViewHandle(
  value: unknown,
): value is PlatformWebViewHandle {
  return (
    typeof value === "object" &&
    value !== null &&
    "goBack" in value &&
    typeof value.goBack === "function" &&
    "reload" in value &&
    typeof value.reload === "function"
  );
}

export type PlatformWebViewProps = Pick<
  WebViewSharedProps,
  | "source"
  | "originWhitelist"
  | "onShouldStartLoadWithRequest"
  | "onNavigationStateChange"
  | "onLoadStart"
  | "onLoadProgress"
  | "onLoadEnd"
  | "onError"
  | "javaScriptEnabled"
  | "style"
>;

const PlatformWebView = forwardRef<PlatformWebViewHandle, PlatformWebViewProps>(
  () => null,
);

export default PlatformWebView;
