import { checkIsLoggedIn } from "@/common/lib/route-guard"

const customerRoutes = [{
  path: "/customer",
  component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Layout"),
  beforeEnter: checkIsLoggedIn,
  children: [
    {
      path: "/",
      name: "customer-dashboard",
      meta: {
        pageHeader: "Home",
        drawerButtons: [
          { text: "Dashboard", disabled: false, active: true, route: { name: "customer-home" }, img: "@/assets/grid.png" },
          { text: "My Test", disabled: false, active: false, route: { name: "" }, img: "@/assets/box.png" },
          { text: "My EMR", disabled: false, active: false, route: { name: "customer-emr"}, img: "@/assets/file-text.png" },
          { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" }
        ]
      },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home")
    },
    {
      path: "emr",
      name: "customer-emr",
      meta: {
        pageHeader: "Emr",
        drawerButtons: [
          { text: "Dashboard", disabled: false, active: false, route: { name: "customer-dashboard" }, img: "@/assets/grid.png" },
          { text: "My Test", disabled: false, active: false, route: { name: "" }, img: "@/assets/box.png" },
          { text: "My EMR", disabled: false, active: true, route: { name: ""}, img: "@/assets/file-text.png" },
          { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" }
        ]
      },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr")
    },
    {
      path: "emr/create",
      name: "customer-emr-create",
      meta: {
        pageHeader: "Emr",
        drawerButtons: [
          { text: "Dashboard", disabled: false, active: false, route: { name: "customer-dashboard" }, img: "@/assets/grid.png" },
          { text: "My Test", disabled: false, active: false, route: { name: "" }, img: "@/assets/box.png" },
          { text: "My EMR", disabled: false, active: true, route: { name: "customer-emr"}, img: "@/assets/file-text.png" },
          { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" }
        ]
      },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr/Create")
    }
  ]
}]

export default customerRoutes
