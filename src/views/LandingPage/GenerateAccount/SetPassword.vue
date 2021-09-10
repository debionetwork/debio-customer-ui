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

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;

        display: flex;
        align-items: center;

        margin-bottom: 28px;
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
    & > .password-field {
        width: 504px;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp
        template(v-slot:header): div(class='pop-up-header' v-on:click='previous')
            img(height='22px' src='@/assets/chevron.png')
            h2.pop-up-title Set Your Password
        template(v-slot:main): div.pop-up-main
            p You will need to input this password later when making transactions with this account.
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
            v-text-field(
                label="Confirm your password"
                v-model="passwordConfirm"
                class="password-field"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :rules="[passwordConfirmRule]"
                :disabled="isLoading"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                @keyup.enter="onPasswordSet"
                outlined
            )
            vue-recaptcha(
                @verify="onVerifyRecaptcha"
                :sitekey="sitekey"
            )
            v-btn(class='white--text' elevation='0' color='primary' @click="registrationSuccess") Continue
</template>

<script>
import axios from "axios"
import VueRecaptcha from "vue-recaptcha"
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'SetPassword',
    components: {
        LandingPagePopUp,
        VueRecaptcha,
    },
    data: () => ({
        passwordsValid: false,
        password: "",
        passwordConfirm: "",
        showPassword: false,
        showPasswordConfirm: false,
        recaptchaVerified: false,
        isLoading: false,
    }),
    computed: {
        sitekey() {
            return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
        },

        passwordConfirmRule() {
            if(!!this.password && this.password == this.passwordConfirm) {
                return true
            }
            return 'Passwords must match.'
        },
    },
    methods: {
        previous() {
            this.$router.push({name: 'generate-mnemonic'});
        },

        registrationSuccess() {
            this.$router.push({name: 'registration-success'});
        },
        
        async onVerifyRecaptcha(response) {
            let recaptchaBackendUrl = ''
            if (process.env.NODE_ENV == 'demo') {
                recaptchaBackendUrl = `${process.env.VUE_APP_DEGENICS_BACKEND_URL}/recaptcha`;
            } 
            else {
                recaptchaBackendUrl = `${process.env.VUE_APP_DEV_DEGENICS_BACKEND_URL}/recaptcha`;
            }
            const result = await axios.post(recaptchaBackendUrl, { response });

            if (result.data.success) {
                this.recaptchaVerified = true;
            }
        },
    },
}
</script>