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
    justify-content: space-between;
    grid-area: main;

    height: 100%;

    & > * {
        margin-bottom: 20px;
    }
    p {
        width: 504px;
        height: 27px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;

        display: flex;
        align-items: center;
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

        margin-bottom: 58px;
    }
    .v-file-input {
        width: 488px;

        font-family: Raleway;
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 150%;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp
        template(v-slot:header): div(class='pop-up-header' v-on:click='previous')
            img(height='22px' src='@/assets/chevron.png')
            h2.pop-up-title Input Mnemonic Phrase
        template(v-slot:main): div.pop-up-main
            div
                p Please type in your Mnemonic Phrase
                v-textarea(no-resize outlined)
            div
                v-btn(class='white--text' elevation='0' color='primary') Continue
</template>

<script>
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'InputPassword',
    components: {
        LandingPagePopUp,
    },
    data: () => ({
        password: "",
        showPassword: false,
        isLoading: false,
    }),
    methods: {
        previous() {
            this.$router.push({name: 'landing-page'});
        },

        signIn() {
            this.$router.push({name: 'sign-in'});
        },
    },
}
</script>