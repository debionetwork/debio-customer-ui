export default {
  data: () => ({ formErrors: [], error: null }),
  
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
      Object.entries(this.$options.debioRules).forEach(([key, value]) => {
        let error = null
        const context = this

        if (Array.isArray(value)) {
          error = value.reduce((filtered, rule) => {
            const isError = rule.call(this, context[key])

            if (typeof isError !== "boolean") filtered.push({ message: isError })

            return filtered
          }, [])

          this.error = error

          return
        }

        Object.entries(value).forEach(([key, value]) => {
          const error = value.reduce((filtered, rule) => {
            const isError = rule.call(this, context[key])

            if (typeof isError !== "boolean") filtered.push({ message: isError })

            return filtered
          }, [])

          this.error = error
        })
      })
    }
  }
}
