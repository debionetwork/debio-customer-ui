export default {
  methods: {
    /**
     * @param type
     * @param value
    */
    pageView(value, type = "track") {
      window.fbq(type, `Visiting ${value} Page`)
    }
  }
}
