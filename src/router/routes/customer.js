import { checkIsLoggedIn } from "@/common/lib/route-guard"

const customerRoutes = [{
  path: "/customer",
  component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Layout"),
  beforeEnter: checkIsLoggedIn,
  children: [
    {
      path: "/",
      name: "customer-dashboard",
      meta: { pageHeader: "Home" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home")
    },
    {
      path: "emr",
      name: "customer-emr",
      meta: { pageHeader: "Emr" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr")
    },  
    {
      path: "create",
      name: "customer-emr-create",
      meta: { pageHeader: "Emr Create", parent: "customer-emr" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr/Create")
    },
    {
      path: "customer-test",
      name: "customer-test",
      meta: { pageHeader: "My Test"},
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/MyTest")
    },
    {
      path: "request-test",
      name: "customer-request-test",
      meta: { pageHeader: "Request Test", parent: "customer-test"},
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/RequestTest")
    },
    {
      path: "select-lab",
      name: "customer-request-test-select-lab",
      meta: {
        pageHeader: "Select Lab", parent: "customer-test"
      },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/RequestTest/SelectLab")
    },
    {
      path: "checkout",
      name: "customer-request-test-checkout",
      meta: {
        pageHeader: "Checkout", parent: "customer-test"
      },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/RequestTest/RequestTestCheckout")
    },
    {
      path: "success",
      name: "customer-request-test-success",
      meta: {
        pageHeader: "Success", parent: "customer-test"
      },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/RequestTest/Success")
    }
  ]
}]

export default customerRoutes
