<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-main{
    justify-content: space-between;
    height: 100%;
    
    & > div > div.forgot-password-text {
        width: 100%;
        height: 51px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 150%;
        color: $color-primary;

        display: flex;
        justify-content: flex-end;

        & > * {
            cursor: pointer;
        }
    }

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
            div.d-flex.flex-column
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
                div.forgot-password-text: div(v-on:click="forgotPassword") Forgot your password?
            div: v-btn(class='white--text' elevation='0' color='primary' @click='selectRole') Continue
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

        selectRole() {
            this.$router.push({name: 'select-role'});
        },

        forgotPassword() {
            this.$router.push({name: 'forgot-password'});
        },
    },
}
</script>