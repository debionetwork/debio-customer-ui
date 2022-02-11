<template lang="pug">
  ui-debio-stepper(
    :items="stepperItems"
  )
  
</template>

<script>
export default {
  name: "RequestAnalysis",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: true },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: false }
    ]
  })
}
</script>
