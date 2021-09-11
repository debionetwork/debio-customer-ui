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
            div: v-btn.white--text(
                :disabled='!password'
                elevation='0' 
                color='primary' 
                @click='decryptWallet'
            ) Continue
            
            v-snackbar(
                v-model="snackbar"
                :timeout="timeout"
                right
                bottom
            ) {{ errorMessage }}
</template>

<script>
import { mapGetters } from "vuex"
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
        snackbar: false,
        timeout: 2000,
        errorMessage: '',
    }),

    computed: {
        ...mapGetters({
            api: 'substrate/getAPI',
            pair: 'substrate/wallet',
        }),
    },

    methods: {
        previous() {
            this.$router.push({name: 'landing-page'})
        },

        forgotPassword() {
            this.$router.push({name: 'forgot-password'})
        },

        decryptWallet() {
            try {
                this.errorMessage = ''
                this.pair.unlock(this.password)
            }
            catch (err) {
                console.error(err)
                this.snackbar = true
                this.errorMessage = err.message
                return
            }
            this.$router.push({name: 'select-role'})
        },
    },
}
</script>