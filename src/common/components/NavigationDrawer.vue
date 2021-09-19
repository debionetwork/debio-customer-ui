<style lang="scss">
.sidebar-text{
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-size: 13pt !important;
}
.dg-raleway-font{
  font-family: 'Raleway', sans-serif;
}
.btn-drawer{
  align-items: center;
  text-align: left;
  padding-left: 0%;
  justify-content: left;
  // align-content: flex-start;
}
.lineDivider{
  margin-left: 35px;
  margin-right: 35px;
  margin-top: 5px;
  border-color: #FF56E0 !important;
}
.footerDrawer{
  align-content:flex-end;
  margin-top: 100px;
  margin-left: 20%;
}

.footerDrawer a {
  font-size: 13px;
  color: grey;
  font-family: 'Raleway', sans-serif;
}

.footer{
  align-items: flex-start;
  align-content: flex-start;
  text-align: left;
}
.dbioLogo {
  margin-left: 30px;
  margin-bottom: 100px;
}
.iconLogo {
  height: 125px;
  width: 125px;
}
.textBox {
  margin-bottom: -15px;
  margin-top: -15px
}
.textLogo {
  font-size: 30px;
  color: #FF56E0;
}
.subtexBox {
  margin-top: -5px;
}
.subTextLogo {
  font-size: 10px;
  margin-top: -10px;
  color: #FF56E0;
}
.text-left {
  align-content: flex-start;
}

</style>

<template lang="pug">
  v-Navigation-drawer(
    app
    clipped
    fixed
    permanent
    :width="width"
    class="mr-10 pt-10 dg-raleway-font"
  )
    div.dbioLogo
      a(
        href="https://www.degenics.com/"
        target="_blank"
        style="text-decoration: none"
      )
        div(class="d-flex align-center")
          v-img(
            alt="dbio Logo"
            class="shrink mr-2"
            contain
            src="@/assets/debio-logo.png"
            transition="scale-transition"
            width="52px"
            height="52px"
          )
          div(class="pt-3 fluid")
            div(class="textBox")
              span(class="textLogo font-weight-bold light_primary--text dg-raleway-font") DeBio
            v-row(class="subtextBox")
              v-col(cols="18" class="ml-3 pa-0")
                b(class="subTextLogo font-weight-bold light_primary--text dg-raleway-font") Powered by
              v-col(cols="4" class="my-0 ml-0 mt-2 pa-0")
                v-img(
                  alt="Octopus Logo"
                  class="shrink mr-2"
                  contain
                  prepend
                  center
                  src="@/assets/octopus.png"
                  transition="scale-transition"
                  width="9"
                )
    v-flex
      v-container(
        class="ml-5 pt-2 pb-2 dg-raleway-font"
        v-for="(item, key) in drawerButtons" :key="key")
          Button.btn-drawer(
            :class="item.active ? 'font-weight-bold sidebar-text primary--text' : 'font-weight-bold sidebar-text'"
            text
            :style="item.active ? style: ''"
            @click="goLink(item.route)"
            :width="width"
            :height="'50px'"
          )
            v-img(
              class="mr-2 ml-2 shrink"
              apend
              center
              contain
              :src="item.img"
              width="24px"
              height="24px"
            )
            span(class="text=left") {{ item.text }}
      
      v-divider.lineDivider
      v-container(class="ml-5 pt-2 pb-2")
        div
          Button(
            outlined
            :height="'35px'"
            @click="goToRequestTestPage"
            class="font-weight-bold sidebar-text primary--text mt-4 dg-raleway-font"
            :color="'#FF56E0'") Request a Test
          
          Button(
            outlined
            :height="'35px'"
            @click="goToUploadEMR"
            class="font-weight-bold sidebar-text primary--text mt-4 dg-raleway-font"
            :color="'#FF56E0'") Upload EMR

        v-spacer
        div.footerDrawer
          a(
            href="#"
            target="_blank"
            style="text-decoration: none"
          )
            div 
              span Help and
            div
              span Documentation
</template>

<script>

import Button from '@/common/components/Button'

export default {
  name: 'NavigationDrawer',
  components: {
    Button
  },
  props: {
    width: String,
  },
  data: () => ({
    // width: "1000px",
    // color: "black",
    style: "background-image: linear-gradient(to right, #C400A5 1%, white 10%)"
  }),

  mounted() {
    console.log(this.drawerButtons, 'drawerBUtton')
  },

  methods: {
    goLink(route){
      console.log('go to route ' + route)
      return
      // if(route != undefined && route.name != this.$route.name){
      //   this.$router.push(route)
      // } //open if other page is done
    },

    goToRequestTestPage() {
      console.log('go to request test page') //should be function go to request test
    },

    goToUploadEMR() {
      console.log('upload EMR') //should be function go to upload emr page
    },

    openHref(href){
      window.open(href, '_blank').focus();
    }
  },

  computed: {
    drawerButtons() {
      if (this.$route.meta && this.$route.meta.drawerButtons) {
        return this.$route.meta.drawerButtons
      }
      return []
    }
  }
}
</script>