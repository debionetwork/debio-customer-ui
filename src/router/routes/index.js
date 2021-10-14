import signInRoutes from "./signIn"
import generateAccountRoutes from "./generateAccount"

const indexRoutes = [{
  path: "/",
  component: () => import(/* webpackChunkName */ "../../views/LandingPage/Layout"),
  children: [
    {
      path: "/",
      name: "landing-page",
      component: () => import(/* webpackChunkName */ "../../views/LandingPage")
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
