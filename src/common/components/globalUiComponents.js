import Vue from "vue"

Vue.component("ui-debio-card", () => import("@/common/components/Card"))
Vue.component("ui-debio-avatar", () => import("@/common/components/Avatar"))
Vue.component("ui-debio-icon", () => import("@/common/components/Icon"))
Vue.component("ui-debio-stepper", () => import("@/common/components/Stepper"))

// Forms
Vue.component("ui-debio-input", () => import("@/common/components/Input"))
Vue.component("ui-debio-textarea", () => import("@/common/components/Textarea"))
Vue.component("ui-debio-file", () => import("@/common/components/File"))
Vue.component("ui-debio-dropdown", () => import("@/common/components/Dropdown"))
