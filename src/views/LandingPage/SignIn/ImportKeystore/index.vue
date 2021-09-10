<style scoped lang="scss">
.pop-up-main{
    img {
        width: 152px;
        height: 152px;
    }
    h2 {
        width: 337px;

        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 150%;
        
        text-align: center;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp
        template(v-slot:main): div.pop-up-main
            img(src='@/assets/alert-circle.png')
            h2 No Accounts Found
            v-btn(class='white--text', elevation='0', color='primary') Generate Account
            v-btn(elevation='0', color='primary', outlined) Import Keystore
</template>

<script>
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'ImportKeystore',
    components: {
        LandingPagePopUp,
    },
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