import "dotenv/config";
export default {
  expo: {
    name: "MyRepartidor",
    slug: "MyRepartidor",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    ios: {
      bundleIdentifier: "cu.adonis.myrepartidor",
      buildNumber: "1.0.0",
    },
    android: {
      package: "cu.adonis.myrepartidor",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      androidClientId: process.env.ANDROID_CLIENT_ID,
      facebookAppId: process.env.FACEBOOK_APP_ID,
    },
  },
};
