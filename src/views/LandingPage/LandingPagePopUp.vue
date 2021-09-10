<style lang="scss">
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
.landing-page-pop-up {
    width: 665px;
    height: 560px;

    background: white;
    border-radius: 16px;

    box-shadow: 0px 2px 10px 0px #0000001A;

    display: grid;
    grid-template-rows: 145px 415px;
    grid-template-areas: 
        "header"
        "main";

    header {
        display: flex;
        align-items: center;
    }
}
.pop-up-main{
    & > * {
        margin-bottom: 20px;
    }
    & > .password-field a {
        width: 504px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;
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
    .v-file-input {
        width: 488px;

        font-family: Raleway;
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 150%;
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
}
</style>

<template lang="pug">
    div.landing-page-pop-up
        header
            div(v-if="hasHeaderSlot")
                div(class='pop-up-header' v-on:click='previous')
                    img(height='22px' src='@/assets/chevron.png')
                    h2.pop-up-title: slot(name="header")
        div.pop-up-main: slot(name="main")
</template>

<script>
export default {
    name: 'LandingPagePopUp',
    
    props: {
        previous: Function,
    },

    computed: {
        hasHeaderSlot() {
            return !!this.previous
        }
    },
}
</script>
