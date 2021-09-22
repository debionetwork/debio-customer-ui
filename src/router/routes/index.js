import signInRoutes from "./signIn"
import generateAccountRoutes from "./generateAccount"
import { checkIsLoggedIn } from "@/common/lib/route-guard"

const indexRoutes = [{
  path: "/",
  component: () => import(/* webpackChunkName */ "../../views/LandingPage/Layout"),
  children: [
    {
      path: "/",
      name: "landing-page",
      component: () => import(/* webpackChunkName */ "../../views/LandingPage")
    },
    {
      path: "/select-role",
      name: "select-role",
      beforeEnter: checkIsLoggedIn,
      component: () => import(/* webpackChunkName */ "../../views/LandingPage/SelectRole")
    },

    ...generateAccountRoutes,
    ...signInRoutes
  ]
}]
  
import customerRoutes from "./customer"

export {
  indexRoutes,
  customerRoutes
}
