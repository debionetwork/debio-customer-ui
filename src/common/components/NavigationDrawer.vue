<style lang="scss">
.drawer{
  background: #f5f7f9 !important;
  border: unset !important;
}

.v-navigation-drawer__content {
  overflow: unset !important;
}

.sidebar-text{
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-size: 13pt !important;
}
.btn-drawer{
  align-items: center;
  text-align: left;
  padding-left: 0%;
  justify-content: left;
  background-color: unset !important;
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
}

.footer{
  align-items: flex-start;
  align-content: flex-start;
  text-align: left;
}
.dbioLogo {
  margin: 0 32px;
  margin-bottom: 72px;
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
    stateless
    class="mr-10 pt-10 drawer dg-raleway-fontindigo darken-1"
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
      .mx-8.pt-2.pb-2.dg-raleway-font(v-for="(item, key) in items" :key="key")
        Button.btn-drawer(
          :class="item.active ? 'font-weight-bold sidebar-text primary--text' : 'font-weight-bold sidebar-text'"
          text
          @click="goLink(item.route)"
          block
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
      .d-flex.flex-column.mx-8
        slot
        v-spacer
</template>

<script>

import Button from "@/common/components/Button"

export default {
  name: "NavigationDrawer",
  components: { Button },

  props: {
    items: { type: Array, default: () => [] },

    width: { type: String, default: "auto" }
  },

  data: () => ({
    style: "background-image: linear-gradient(to right, #C400A5 1%, white 10%)"
  }),

  methods: {
    goLink(route){
      this.$router.push({ name: route })
    },

    openHref(href){
      window.open(href, "_blank").focus()
    }
  }
}
</script>
