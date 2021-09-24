export default {
  data: () => ({ formErrors: [] }),
  
  computed: {
    computeError() {
      return this.formErrors.some(error => error.status === true)
    }
  },

  methods: {
    handleError(name, val) {
      this.formErrors = this.formErrors?.filter(error => error.name !== name)
      
      this.formErrors.push({ name: name, status: val })
    }
  }
}
