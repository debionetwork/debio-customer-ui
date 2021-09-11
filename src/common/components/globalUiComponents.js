import Vue from "vue"

Vue.component("ui-debio-card", () => import("@/common/components/Card"))
Vue.component("ui-debio-avatar", () => import("@/common/components/Avatar"))
Vue.component("ui-debio-icon", () => import("@/common/components/Icon"))

// Forms
Vue.component("ui-debio-input", () => import("@/common/components/Input"))