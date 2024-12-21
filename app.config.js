import 'dotenv/config';

export default {
  expo: {
    name: "GEROcuidado",
    slug: "gerocuidado",
    jsEngine: "jsc",
    scheme: "gero.cuidado",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      package: "com.gerocuidado.gerocuidado",
      config: {
        usesCleartextTraffic: true  // Permitindo tráfego de texto não criptografado (HTTP)
      }
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-router"
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,  // API URL
      apiUsuarioPort: process.env.EXPO_PUBLIC_API_USUARIO_PORT,  // Porta do API de usuário
      apiForumPort: process.env.EXPO_PUBLIC_API_FORUM_PORT,  // Porta do API de fórum
      apiSaudePort: process.env.EXPO_PUBLIC_API_SAUDE_PORT,  // Porta do API de saúde
      jwtSecret: process.env.EXPO_PUBLIC_JWT_TOKEN_SECRET,  // Token JWT
      eas: {
        projectId: "55d5ddda-991d-4353-a4c9-378e8c508639",  // Project ID do EAS
      }
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/7028a81c-adee-41de-91a7-b7e80535a448"
    }
  }
};
