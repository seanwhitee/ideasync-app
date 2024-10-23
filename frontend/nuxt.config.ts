// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-08-08",
  ssr: false,
  devtools: { enabled: false },
  pages: true,
  tailwindcss: {
    cssPath: ["~/assets/css/main.css", { injectPosition: "first" }],
    configPath: "tailwind.config.js",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  colorMode: {
    preference: "dark",
  },
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
  ],
  image: {
    dir: "assets/images",
  },
  runtimeConfig: {
    awsAccessKey: "",
    awsSecretAccessKey: "",
    awsBucketName: "",
    awsBucketRegion: "",
    public: {
      baseUrl: "",
    },
  },
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
      style: [],
      script: [],
      noscript: [],
    },
  },
});
