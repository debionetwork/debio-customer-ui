<style scoped lang="scss">
.pop-up-main{
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-area: main;

    * {
        margin-bottom: 20px;
    }
    .pop-up-title{
        width: 462px;
        height: 76px;

        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 35px;
        line-height: 41px;
        color: #363636;

        margin-bottom: 50px;
    }
    .v-btn {
        width: 452px;
        height: 53px !important;
        
        font-family: Raleway;
        font-style: normal;
        font-weight: 600;
        font-size: 20px !important;
        line-height: 30px;
        text-transform: none;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp: template(v-slot:main): div.pop-up-main
        div.pop-up-title The Privacy-First Platform for Personal Genetic Testing
        v-btn(class='white--text' elevation='0' color='primary') Sign In
        v-btn(elevation='0' outlined color='primary' @click="generateAccount") Generate Account
</template>

<script>
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'MainPage',
    components: {
        LandingPagePopUp,
    },
    methods: {
        generateAccount() {
            this.$router.push({name: 'generate-account'});
        }
    },
}
</script>