# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class xyz.our_space.xdev.violetadigital.* {
  native <methods>;
}

-keep class xyz.our_space.xdev.violetadigital.WryActivity {
  public <init>(...);

  void setWebView(xyz.our_space.xdev.violetadigital.RustWebView);
  java.lang.Class getAppClass(...);
  java.lang.String getVersion();
}

-keep class xyz.our_space.xdev.violetadigital.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class xyz.our_space.xdev.violetadigital.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void loadHTMLMainThread(...);
  void evalScript(...);
}

-keep class xyz.our_space.xdev.violetadigital.RustWebChromeClient,xyz.our_space.xdev.violetadigital.RustWebViewClient {
  public <init>(...);
}
