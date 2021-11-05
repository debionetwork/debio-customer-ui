import { generateUUID } from "@/common/utils"

export default {
  props: {
    rules: { type: Array, default: () => [] }
  },

  data: () => ({ isError: null, uuid: null }),

  computed: {
    computeErrorMessage() {
      const message = this.isError

      return message && message[0]?.message ? message[0]?.message : ""
    }
  },

  created() {
    this.uuid = generateUUID()
    if (this.rules?.length) this.$emit("isError", this.uuid, true)
  }
}
