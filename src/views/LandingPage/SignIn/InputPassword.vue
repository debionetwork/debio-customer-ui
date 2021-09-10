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
        template(v-slot:header) Sign In
        template(v-slot:main): div.pop-up-main
            div
                p Please input your password
                v-text-field(
                    label="Type in your password"
                    v-model="password"
                    class="password-field"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="[val => !!val || 'Password is required']"
                    :disabled="isLoading"
                    @click:append="showPassword = !showPassword"
                    @keyup.enter="onPasswordSet"
                    outlined
                )
            div
                v-btn(class='white--text', elevation='0', color='primary') Continue
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