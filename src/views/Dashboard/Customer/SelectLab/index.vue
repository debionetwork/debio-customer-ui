<template lang="pug">
  v-container.select-lab.mt-16
    template
      Stepper.mt-10( 
        align="center"
        withLineIndicator
        :items="stepperItems"
      )
      
    template
      div.title Select your preferred Laboratory
    
    template(v-if="!showNoLab")
      v-row.mt-10
        v-col(
          cols="12"
          xl="4"
          lg="12"
          v-for="(lab, i) in labs"
          :key="i"
        )
          MenuCard.card-test(
            :avatar="lab._source.info.profile_image"
            :title="lab._source.info.name"
            :address="lab._source.info.address"
            :sub-title="getServiceName(lab._source.services)"
            :description="getServiceDescription(lab._source.services)"
            :price="getServicePrice(lab._source.services)"
            :service-image="getServiceImage(lab._source.services)"
            @click="selectLab(lab, lab._source.services)"
          )

    template(v-if="showNoLab")
      v-card.no-lab-card
        div.card-title Oops!
        div.card-sub-title There are no available labs provide this service in your area.
        div.card-body 
          div 1. You can request a lab to register to DeBio by clicking the "Request a service" button.
          div 2. Additionally, you can stake an amount of tokens or regular currency (USD), which will be given as an incentive to labs registering in your location.
          div 3. Labs will use the result of this form, filled-in by you and other DeBio users, to evaluate the demand in the area you designated. 
      v-row(class="d-flex justify-center mt-16")
        v-col(cols="5")
          Button.mt-5.mb-10(
            color="secondary" 
            width="560"
            height="38"
            @click="showingAgreementDialog"
            ) Request a service

      template
        AgreementDialog(
          :show="showAgreement"
          @close="closingDialog"
          @click="onClickDialogButton"
        )

      template
        Dialog(
          :show="showSuccessDialog"
          :width="289"
          message="Your request has been submitted"
          imgPath="check-circle.png"
          btn-message="Back to Dashboard"
          @close="closingDialog"
          @click="toHomePage"
          )
  
</template>

<script>

import { mapState, mapMutations } from "vuex"
import Stepper from '@/common/components/Stepper'
import MenuCard from '@/common/components/MenuCard'
import Button from '@/common/components/Button'
import Dialog from '@/common/components/Dialog'
import AgreementDialog from '@/common/components/Dialog/AgreementDialog.vue'


export default {
  name: "SelectLab",
    components: {
    Stepper,
    MenuCard,
    Button,
    Dialog,
    AgreementDialog,
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: 'Select a location and Service Category', active: false },
      { number: 2, title: 'Select a lab', active: true },
      { number: 3, title: 'Checkout', active: false },
      { number: 4, title: 'Payment', active: false },
    ],
    showNoLab: false,
    showAgreement: false,
    showSuccessDialog: false
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs
    }),
  },

  async mounted () {
    if (!this.labs.length) {
      this.showNoLab = true
    }
  },

  methods : {

    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),

    getServiceName(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.name
        }
      }
    }, 

    getServiceDescription(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.description
        }
      }
    },

    getServicePrice(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.prices_by_currency[0].total_price
        }
      }
    },

    getServiceImage(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.image
        }
      }
    },
    async selectLab(lab, services) {

      let selectedProduct
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          selectedProduct = services[i]
        }
      }
      
      this.setProductsToRequest(selectedProduct)
      this.setLabToRequest(lab)
      this.$router.push({ name: 'request-test-checkout' })
    },

    showingAgreementDialog () {
      console.log("showingg...")
      this.showAgreement = true
    },

    closingDialog() {
      this.showAgreement = false
    },

    onClickDialogButton() {
      console.log("kesini ?")
      this.showAgreement = false
      this.showSuccessDialog = true
    },

    toHomePage () {
      this.$router.push({ name: 'customer-dashboard' })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-lab {
    width: auto;
    height: 732px;
    background: #FFFFFF;
}

.title {
  font-family: 'Raleway';
  margin-top: 5%;
  font-size: 20px;
  line-height: 150%;
  display: flex;
  justify-content: center;
}

.card-title {
  font-family: 'Raleway';
  font-size: 20px;
  margin-left: 3%;
  margin-right: 3%;
  padding-top: 2%;
}

.card-sub-title {
  font-family: 'Raleway';
  font-size: 14px;
  margin-top: 2%;
  margin-left: 3%;
  margin-right: 3%;
  margin-bottom: 3%;
  color:#F92020;
}

.card-body {
  font-family: 'Raleway';
  font-size: 14px;
  margin-left: 3%;
  margin-right: 3%;
}

.no-lab-card {
  padding: 5%;
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
  border-radius: 4px;
}

.card-test {
  color: black;
}
</style>