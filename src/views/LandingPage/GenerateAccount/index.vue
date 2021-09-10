<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-header{
    display: flex;
    align-items: center;
    grid-area: header;

    margin-left: 33px;

    cursor: pointer;

    .pop-up-title{
        display: block;

        color: $color-primary;
        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 150%;

        margin-left: 26px;
    }
}
.pop-up-main{
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-area: main;

    & > * {
        margin-bottom: 20px;
    }
    h3 {
        width: 504px;
        height: 60px;

        font-family: Raleway;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 150%;
        /* or 30px */

        display: flex;
        align-items: center;
    }
    p {
        width: 504px;
        height: 63px;

        /* body-text-1 */

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;
        /* or 27px */

        display: flex;
        align-items: center;

        margin-bottom: 50px;
    }
    .v-input--checkbox {
        width: 437px;
        height: 53px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;

        display: flex;
        align-items: center;

        #checkboxLabel {
            font-size: 18px;
            line-height: 150%;
            margin-left: 20px;
        }
    }
    .v-btn {
        width: 506px;
        height: 53px !important;
        
        font-family: Raleway;
        font-style: normal;
        font-weight: 600;
        font-size: 20px !important;
        line-height: 30px;
        text-transform: none;
        margin-bottom: 20px;
    }
    // Override default Vuetify CSS
    .theme--light.v-btn.v-btn--disabled{
        color: white !important;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp
        template(v-slot:header): div(class='pop-up-header' v-on:click='previous')
            img(height='22px' src='@/assets/chevron.png')
            h2.pop-up-title Backup your account
        template(v-slot:main): div.pop-up-main
            h3 We will give you 12 words that allows you to recover an account
            p You need to carefully save the  words. Copy-paste it, screenshot it, write it down, and keep it safe. If you lose it, we won't be able to help you recover it.
            v-checkbox(v-model="agreeConditions"): template(v-slot:label): div#checkboxLabel I understand that if I lose my recovery words, I will not be able  to access my account
            v-btn(class='white--text' elevation='0' color='primary' :disabled="!agreeConditions" @click="generateMnemonic") Continue
</template>

<script>
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'GenerateAccount',
    components: {
        LandingPagePopUp,
    },
    data: () => ({
        agreeConditions: false,
    }),
    methods: {
        previous() {
            this.$router.push({name: 'landing-page'});
        },
        generateMnemonic() {
            this.$router.push({name: 'generate-mnemonic'});
        },
    },
}
</script>