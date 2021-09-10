<style scoped lang="scss">
.pop-up-main{
    justify-content: space-between;
    height: 100%;

    p {
        height: 27px;
    }
    .v-btn {
        margin-bottom: 58px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Input Mnemonic Phrase
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