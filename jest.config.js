module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  globals: {
    "vue-jest": {
      pug: {
        doctype: "html"
      }
    }
  },
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    "vue"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "vuetify/lib(.*)": "<rootDir>/node_modules/vuetify/es5$1",
    "@polkadot/ui-keyring": "<rootDir>/tests/unit/@polkadot-ui-keyring.mock.js",
    "@polkadot/keyring": "<rootDir>/tests/unit/@polkadot-keyring.mock.js",
    "@polkadot/api": "<rootDir>/tests/unit/@polkadot-api.mock.js"
  },
  modulePaths: [
    "<rootDir>/src",
    "<rootDir>/node_modules"
  ],
  transform: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.ts?$": "ts-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(vuetify)/)"
  ]
}
