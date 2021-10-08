export default {
  data: () => ({ formErrors: [] }),
  
  computed: {
    computeError() {
      const error = this.formErrors.some(error => error.status === true)

      this.$emit("hasFormErrors", error)

      return error
    }
  },

  methods: {
    handleError(name, val) {
      this.formErrors = this.formErrors?.filter(error => error.name !== name)

      this.formErrors.push({ name: name, status: val })
    }
  }
}
