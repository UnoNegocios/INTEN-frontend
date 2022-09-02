module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack:{
    output: {
      filename: '[name].[hash].bundle.js'
    }
  },
  pwa: {
    name: 'UNO CRM',
    short_name: 'UNO CRM',
    themeColor: '#ff5000',
    msTileColor: '#ff5000',
    backgroundColor: '#ff5000',
    manifestOptions: {
        icons: [
            {
                src: "/favicon-16x16.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/favicon-16x16.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
    },
    /*
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#ff5000',
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'dev/sw.js',
      // ...other Workbox options...
    }
    */
  },
  lintOnSave: false
}