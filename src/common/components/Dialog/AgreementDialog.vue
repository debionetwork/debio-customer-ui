<template lang="pug">
  v-dialog(:value="show" width="480" persistent)
    v-card
      v-app-bar(flat dense color="white" )
        v-toolbar-title(class="title mt-8" style="font-family: Raleway") Staking Coin Agreement
        v-spacer
        v-btn( class="mt-8" icon @click="closeDialog")
          v-icon mdi-close
      v-card(class="ms-4 me-4" style="background-color: #F5F7F9; font-family: Raleway ")
        v-card-text(class="mb-4 mt-10")
          div(style="font-size: 12px" class="me-3" )
            div 1. Your funds will be staked in smart contract.
            div 2. You can unstake your funds at any moment. Your funds will be withdrawn to your wallet in 6 days or 144 hours from the moment you confirm an unstake request. 
            div 3. You will receive DBIO as a reward upon a successful request test when the service is ready. DBIO reward percentage will be determined by DAOGenics.


      v-card-text(class="mt-4 pb-0 text-subtitle-1")
        div(class="text-body-1 mt-10")
          div.mb-3 Enter your Amount
            v-row
              v-col(
                cols="12"
                sm="9"
              )
              
                v-text-field(
                  v-model="amount"
                  outlined
                )
              
              v-col(
                cols="12"
                sm="3"
              )
                
                v-select(
                  outlined
                  max="30"
                  v-model="currencyType"
                  :items="currencyList"
                  :rules="[val => !!val || 'Currency Type is Required']"
                )

        v-checkbox(class="mt-5" v-model="agree")
          template(v-slot:label)
            b I have read and agree to the <a> terms and conditions </a>


      v-card-actions(class="px-6 pb-4")
        v-btn(
          depressed
          color="secondary"
          large
          width="100%"
          @click="submitServiceRequestStaking"
          :disabled="!agree || isLoading || !amount"
          :loading="isLoading"
        ) Continue

</template>


<script>
import { mapState } from 'vuex'
import { startApp, getTransactionReceiptMined } from '@/common/lib/metamask'
import { approveDaiStakingAmount, checkAllowance, sendServiceRequestStaking } from '@/common/lib/metamask/service-request'
import localStorage from "@/command/lib/local-storage"



export default {
  name: "AgreementDialog",

  props: {
  show: Boolean,
  },

  data: () => ({
    currencyList: ['DAI'], // Currently only staking in DAI is supported
    currencyType: 'DAI',
    agree: false,
    amount: "",
    dialogAlert: false,
    isLoading: false,
    transactionStep: ''
  }),
  computed: {
    ...mapState({
      country: state => state.lab.country,
      city: state => state.lab.city,
      category: state => state.lab.category,
    }),
  },
  
  methods: {
    closeDialog() {
      this.$emit('close')
    },

    async submitServiceRequestStaking() {
      console.log("SUBMIT")
      this.ethAccount = await startApp();
      if (this.ethAccount.currentAccount == "no_install") {
        this.isLoading = false;
        this.password = "";
        this.error = "Please install MetaMask!";
        return
      }

      try {
        this.isLoading = true

        const stakingAmount = this.amount
        const stakingAmountAllowance = await checkAllowance(this.ethAccount.currentAccount)

        if (stakingAmountAllowance < stakingAmount) {
          const txHash = await await approveDaiStakingAmount(
            this.ethAccount.currentAccount,
            stakingAmount, // Approve only as much as needed to stake
          )
          await getTransactionReceiptMined(txHash)
        }

        const serviceCategory = this.category[0]
        const txHash = await sendServiceRequestStaking(
          this.ethAccount.currentAccount,
          this.country,
          this.city,
          serviceCategory,
          stakingAmount
        )
        await getTransactionReceiptMined(txHash)

        await this.$store.dispatch("lab/setStakingAmount", stakingAmount);

        const address = localStorage.getAddress();
        const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + "customer";
        const listNotificationJson = localStorage.getLocalStorageByName(storageName);

        let listNotification = [];
        if (listNotificationJson != null && listNotificationJson != "") {
          listNotification = JSON.parse(listNotificationJson);
        }

        const dateSet = new Date();
        const timestamp = dateSet.getTime().toString();
        const notifDate = dateSet.toLocaleString("en-US", {
          weekday: "short",
          day: "numeric", 
          year: "numeric",
          month: "long", 
          hour: "numeric",
          minute: "numeric",
        });

        const notification = {
          message: "Your request has been submitted",
          timestamp: timestamp,
          data: "",
          route: "service-request",
          params: "",
          read: false,
          notifDate: notifDate,
        }
          
        listNotification.push(notification)
        localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification));
        listNotification.reverse();

        this.isLoading = false
        this.dialogAlert = true
            this.$emit('click')

      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>


</style>