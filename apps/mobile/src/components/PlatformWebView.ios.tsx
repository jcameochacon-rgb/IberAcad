import { forwardRef, useImperativeHandle, useRef } from "react";
import NativeWebView from "react-native-webview/lib/WebView.ios";
import {
  isPlatformWebViewHandle,
  type PlatformWebViewHandle,
  type PlatformWebViewProps,
} from "./PlatformWebView";

const PlatformWebView = forwardRef<PlatformWebViewHandle, PlatformWebViewProps>(
  (props, ref) => {
    const nativeWebView = useRef<unknown>(null);

    useImperativeHandle(
      ref,
      () => ({
        goBack() {
          if (isPlatformWebViewHandle(nativeWebView.current)) {
            nativeWebView.current.goBack();
          }
        },
        reload() {
          if (isPlatformWebViewHandle(nativeWebView.current)) {
            nativeWebView.current.reload();
          }
        },
      }),
      [],
    );

    return (
      <NativeWebView
        {...props}
        ref={nativeWebView}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled
      />
    );
  },
);

export default PlatformWebView;
