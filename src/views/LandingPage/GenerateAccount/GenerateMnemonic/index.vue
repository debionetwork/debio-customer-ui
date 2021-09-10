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

        /* body-text-1 */

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;
        /* or 27px */

        display: flex;
        align-items: center;

        margin-bottom: 50px;
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
    & > div.copy-text {
        width: 504px;
        height: 51px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 150%;
        color: $color-primary;

        display: flex;
        align-items: center;

        & > * {
            cursor: pointer;
        }
        & > img {
            width: 24px;
            margin-right: 13px;
        }
    }
    ::v-deep .v-snack__wrapper {
        min-width: 0px;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp
        template(v-slot:header): div(class='pop-up-header' v-on:click='previous')
            img(height='22px' src='@/assets/chevron.png')
            h2.pop-up-title Your Secret Backup Phrase
        template(v-slot:main): div.pop-up-main
            h3 Write down or copy these words in the right order and save them safely.
            MnemonicList(:mnemonicCollection="mnemonicCollection")
            div.copy-text 
                img(src='@/assets/copy.png' v-on:click="copyText")
                div(v-on:click="copyText") Copy this Secret Backup Phrase to clipboard
            v-btn(class='white--text' elevation='0' color='primary' @click="verifyMnemonic") Continue
            v-snackbar(
                v-model="snackbar"
                :timeout="timeout"
                right
                bottom
            ) Copied mnemonic!
</template>

<script>
import MnemonicList from './MnemonicList.vue'
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'
import { mnemonicGenerate } from '@polkadot/util-crypto'

export default {
    name: 'GenerateAccount',
    components: {
        LandingPagePopUp,
        MnemonicList,
    },
    data: ()=>({
        mnemonic: '',
        mnemonicCollection: [],
        snackbar: false,
        timeout: 2000,
    }),
    mounted(){
        this.mnemonic = mnemonicGenerate()
        
        const mnemonicCollection = this.mnemonic.split(" ")
        for(let i = 1; i <= mnemonicCollection.length; i++){
            this.mnemonicCollection.push(mnemonicCollection[i-1])
        }
    },
    methods: {
        previous() {
            this.$router.push({name: 'generate-account'});
        },

        verifyMnemonic() {
            this.$router.push({
                name: 'verify-mnemonic',
                params: { 
                    mnemonicCollection: this.mnemonicCollection
                }
            });
        },
        
        copyText(){
            navigator.clipboard.writeText(this.mnemonic);
            this.snackbar = true;
        }
    },
}
</script>