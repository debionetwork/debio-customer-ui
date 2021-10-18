export default {
  data: () => ({ formErrors: [], errorMessages: null }),
  
  computed: {
    computeError() {
      const error = this.formErrors.some(error => error?.status === true)

      this.$emit("hasFormErrors", error)

      return error
    }
  },

  methods: {
    handleError(name, val) {
      this.formErrors = this.formErrors?.filter(error => error.name !== name)

      this.formErrors.push({ name: name, status: val })
    },

    _touchForms() {
      const computeErrors = (objectKey, objectValue) => {
        const context = this

        return objectValue.reduce((filtered, rule) => {
          const isError = rule.call(this, context[objectKey])

          if (typeof isError !== "boolean") filtered.push({ message: isError })

          return filtered
        }, [])
      }

      Object.entries(this.$options.rules).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          this.errorMessages = computeErrors(key, value)

          return
        }

        Object.entries(value).forEach(([key, value]) => {
          this.errorMessages = computeErrors(key, value)
        })
      })
    }
  }
}
