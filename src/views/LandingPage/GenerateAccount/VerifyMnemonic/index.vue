<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Verify Recovery Phrase
        template(v-slot:main): div.pop-up-main
            h3 Tap the words to pull them next to each other in the correct order.
            MnemonicInput(:mnemonicCollection="mnemonicInputs" @click="(inputs) => validate(inputs)")
            v-btn(
                :disabled='!mnemonicValid'
                class='white--text' 
                elevation='0' 
                color='primary' 
                @click="verifyMnemonic"
            ) Continue
</template>

<script>
import { shuffle } from '@/common/lib/arrays'
import MnemonicInput from './MnemonicInput'
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'GenerateAccount',
    components: {
        LandingPagePopUp,
        MnemonicInput,
    },
    data: ()=>({
        mnemonicCollection: [],
        mnemonicInputs: [],
        mnemonicValid: false,
    }),
    mounted(){
        this.mnemonicCollection.push(
            shuffle(...this.$route.params.mnemonicCollection)
        )
        this.mnemonicInputs.push(...this.mnemonicCollection)
    },
    methods: {
        previous() {
            this.$router.push({name: 'generate-mnemonic'});
        },

        verifyMnemonic() {
            this.$router.push({name: 'set-password'});
        },
        
        copyText(){
            navigator.clipboard.writeText(this.mnemonic);
            this.snackbar = true;
        },

        validate(inputs){
            this.mnemonicValid = false
            if(inputs.length < this.mnemonicCollection.length) return

            for(let i = 0; i < inputs.length; i++){
                if(inputs[i] != this.mnemonicCollection[i]) {
                    return
                }
            }
            this.mnemonicValid = true
        }
    },
}
</script>