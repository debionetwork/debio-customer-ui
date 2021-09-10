<style scoped lang="scss">
.pop-up-main{
    p {
        margin-bottom: 28px;
    }
    & > .password-field {
        width: 504px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Set Your Password
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
            Recaptcha(
                :verify="onVerifyRecaptcha"
            )
            v-btn(
                :disabled="!buttonDisabled"
                class='white--text' 
                elevation='0' 
                color='primary' 
                @click="registrationSuccess"
            ) Continue
</template>

<script>
import axios from "axios"
import Recaptcha from "@/common/components/Recaptcha.vue"
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'SetPassword',
    components: {
        LandingPagePopUp,
        Recaptcha,
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
        buttonDisabled(){
            return this.recaptchaVerified && this.isPasswordConfirmed
        },

        isPasswordConfirmed() {
            if(!!this.password && this.password == this.passwordConfirm) {
                return true
            }
            return false
        },

        passwordConfirmRule() {
            if(this.isPasswordConfirmed) {
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