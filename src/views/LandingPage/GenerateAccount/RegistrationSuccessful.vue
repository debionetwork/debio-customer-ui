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
    img {
        width: 95px;
        height: 95px;

        margin-top: 20px;
    }
    h2 {
        width: 337px;
        height: 76px;

        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 150%;
        
        text-align: center;

        margin-bottom: 78px;
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
}
</style>

<template lang="pug">
    LandingPagePopUp
        template(v-slot:header): div(class='pop-up-header' v-on:click='previous')
            img(height='22px' src='@/assets/chevron.png')
            h2.pop-up-title Your Account is ready!
        template(v-slot:main): div.pop-up-main
            img(src='@/assets/check-circle.png')
            h2 Your account has been successfully created.
            v-btn(class='white--text' elevation='0' color='primary' @click="signIn") Sign In
</template>

<script>
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'RegistrationSuccessful',
    components: {
        LandingPagePopUp,
    },
    methods: {
        previous() {
            this.$router.push({name: 'set-password'});
        },

        signIn() {
            this.$router.push({name: 'sign-in'});
        },
    },
}
</script>