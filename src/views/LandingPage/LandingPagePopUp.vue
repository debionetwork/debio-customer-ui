<style>
.landing-page-pop-up {
    width: 665px;
    height: 559px;

    background: white;
    border-radius: 16px;
    padding-bottom: 70px;

    display: grid;
    grid-template-rows: 145px 520px;
    grid-template-areas: 
        "header"
        "main";
}
</style>

<template lang="pug">
    div.landing-page-pop-up
        header: slot(name="header")
        main: slot(name="main")
</template>

<script>
export default {
    name: 'LandingPagePopUp'
}
</script>
