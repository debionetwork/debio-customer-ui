<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-main{
    justify-content: space-between;
    height: 100%;
    
    & > div.role-list {
        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 150%;
        color: $color-primary;

        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;
        grid-template-areas: 
            "customer" "lab"
            "doctor" "hospital";

        & > * {
            cursor: pointer;
        }
    }
}
</style>

<template lang="pug">
     LandingPagePopUp
        template(v-slot:main): div.pop-up-main: div(class='role-list')
            div
                img(src='')
</template>

<script>
import LandingPagePopUp from '@/views/LandingPage/LandingPagePopUp.vue'

export default {
    name: 'InputPassword',
    components: {
        LandingPagePopUp,
    },
    methods: {
        previous() {
            this.$router.push({name: 'landing-page'});
        },
    },
}
</script>