import { checkIsLoggedIn } from "@/common/lib/route-guard"

const customerRoutes = [{
  path: "/customer",
  component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Layout"),
  name: "customer",
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
      meta: { pageHeader: "My EMR" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr")
    },  
    {
      path: "emr/upload",
      name: "customer-emr-create",
      meta: { pageHeader: "Upload EMR" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr/Create")
    },
    {
      path: "emr/details/:id?",
      name: "customer-emr-details",
      meta: { pageHeader: "Details", parent: "customer-emr" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr/Details")
    },
    {
      path: "my-test",
      name: "my-test",
      meta: { pageHeader: "My Test"},
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/MyTest")
    },
    {
      path: "test-result",
      name: "test-result",
      meta: { pageHeader: "Test Result", parent: "customer-test" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/MyTest/TestResult")
    },
    {
      path: "request-test",
      name: "customer-request-test",
      meta: { pageHeader: "Request Test" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/RequestTest")
    },
    {
      path: "success",
      name: "customer-request-test-success",
      meta: { pageHeader: "Success" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/RequestTest/Success")
    },

    // Data Bounty
    {
      path: "data-bounty",
      name: "customer-data-bounty",
      meta: { pageHeader: "Data Bounty" },
      component: () => import(/* webpackChunkName */ "@/views/Dashboard/Customer/Home/DataBounty")
    },

    {
      path: "payment/histories",
      name: "customer-payment-history",
      meta: { pageHeader: "Payment History" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/PaymentHistory")
    },
    {
      path: "payment/details",
      name: "customer-payment-details",
      meta: { pageHeader: "Details", parent: "customer-payment-history" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/PaymentHistory/Details")
    }
  ]
}]

export default customerRoutes
