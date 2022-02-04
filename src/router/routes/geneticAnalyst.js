import { checkIsLoggedIn } from "@/common/lib/route-guard"

export default [
  {
    path: "/",
    name: "dashboard",
    beforeEnter: checkIsLoggedIn,
    redirect: { name: "ga-dashboard" },
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Layout")
  },
  {
    path: "/genetic-analyst",
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Layout"),
    beforeEnter: checkIsLoggedIn,
    name: "genetic-analyst",
    redirect: { name: "ga-dashboard" },
    children: [
      {
        path: "/",
        name: "ga-dashboard",
        meta: { pageHeader: "Home" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Home")
      },
      {
        path: "my-account",
        name: "ga-account",
        meta: { pageHeader: "My Account" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Account")
      },
      {
        path: "my-services",
        name: "ga-services",
        meta: { pageHeader: "My Services" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Services")
      },
      {
        path: "orders",
        name: "ga-orders",
        meta: { pageHeader: "Orders" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Orders")
      }
    ]
  }
]