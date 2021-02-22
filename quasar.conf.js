const { configure } = require("quasar/wrappers")

module.exports = configure(function (/* ctx */) {
  return {
    supportTS: true,

    boot: [
      "i18n"
    ],

    css: [
      "app.sass"
    ],

    extras: [
      "eva-icons",
      "roboto-font",
      "material-icons"
    ],

    build: {
      vueRouterMode: "history"
    },

    devServer: {
      https: false,
      port: 8080,
      open: true
    },

    framework: {
      config: {},
      plugins: [
        "SessionStorage",
        "LocalStorage",
        "Dialog",
        "Notify"
      ]
    },

    animations: "all",

    ssr: {
      pwa: false
    },

    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {},
      manifest: {
        name: `Grallery.ART`,
        short_name: `Grallery.ART`,
        description: `A webside for artists`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      bundler: "packager",
      packager: {},
      builder: {
        appId: "grallery.art"
      },
      nodeIntegration: true
    }
  }
})
