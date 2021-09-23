<template lang="pug"> 
  v-container.request-test.mt-16
    template
      Stepper.mt-10( 
        align="center"
        withLineIndicator
        :items="stepperItems"
      )
      
    template
      v-row(class="d-flex justify-center mt-16")
        v-col(cols="5")
          label Select a country
          v-autocomplete(
            dense
            key="country"
            v-model="country"
            :items="countries"
            item-text="name"
            item-value="iso2"
            placeholder="Country"
            @change="onCountryChange"
            autocomplete="off"
            outlined)

          label Select a region
          v-autocomplete(
            dense
            key="state"
            v-model="state"
            :items="states"
            item-text="name"
            item-value="state_code"
            placeholder="State/Province"
            :disabled="!country"
            @change="onStateChange"
            autocomplete="off"
            outlined)

          label Select a city
          v-autocomplete(
            dense
            key="city"
            v-model="city"
            :items="cities"
            item-text="name"
            return-object
            placeholder="City"
            :disabled="!state"
            @change="onCityChange"
            autocomplete="off"
            outlined)

          label Select a service category
          v-select(
            dense
            :items="categories"
            item-value="labData"
            item-text="labName"
            menu-props="auto"
            placeholder="Category"
            :disabled="!city"
            @change="onCategoryChange"
            autocomplete="off"
            outlined)

          template(v-if="!category" )
            v-icon(color="red") mdi-alert-circle-outline
            span(class="red--text") You haven't selected any service category

          Button(
            class="mt-16"
            color="secondary" 
            width="560"
            height="38"
            @click= "onSubmit"
            ) Continue
              
</template>

<script>
import { mapState, mapMutations } from "vuex"
import Stepper from '@/common/components/Stepper'
import Button from '@/common/components/Button'
import categories from '@/common/constants/categories'
import { getLocations, getStates, getCities } from "@/common/lib/location"



export default {
  name: "RequestTest",

  components: {
    Stepper,
    Button
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: 'Select a location and Service Category', active: true },
      { number: 2, title: 'Select a lab', active: false },
      { number: 3, title: 'Checkout', active: false },
      { number: 4, title: 'Payment', active: false },
    ],
    country: "",
    state: "",
    city: "",
    category: "",
    states: [],
    cities: [],
    categories: [],
    countries: [],
    coinName: ""
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      configApp: (state) => state.auth.configApp,
    }),
  },
  
  async mounted() {
    await this.getCountries()
    this.coinName = this.configApp.tokenName
    this.categories = categories
  },

  methods: {
    ...mapMutations({
      setCategory: "lab/SET_CATEGORY"
    }),
    
    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },
    async onCountryChange(selectedCountry) {
      const { data : { data }} = await getStates(selectedCountry)
      this.states = data
      this.country = selectedCountry
    },
    async onStateChange(selectedState) {
      const { data : { data }} = await getCities(this.country, selectedState)
      this.cities = data
      this.state = selectedState
    },
    async onCityChange(selectedCity) {
      this.city = selectedCity
    },

    async onCategoryChange(selectedCategory) {
      this.category = selectedCategory
    },

    async onSubmit() {
      const country = this.country
      const city = this.city
      const category = this.category
      this.setCategory(category)
      await this.$store.dispatch("lab/setCountryCity", {country, city})
      await this.$store.dispatch("lab/getLabByCategory", category)
      this.$router.push({ name: 'select-lab' })
    },
  }
}
</script>


<style lang="scss" scoped>
.request-test {
    width: auto;
    height: 732px;
    background: #FFFFFF;
}
</style>