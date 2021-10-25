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
      path: "emr/create",
      name: "customer-emr-create",
      meta: { pageHeader: "Emr Create", parent: "customer-emr" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr/Create")
    },
    {
      path: "emr/details/:id",
      name: "customer-emr-details",
      meta: { pageHeader: "Emr Create", parent: "customer-emr" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/Emr/Details")
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
    },

    // Data Bounty
    {
      path: "data-bounty",
      name: "customer-data-bounty",
      meta: { pageHeader: "Data Bounty" },
      component: () => import(/* webpackChunkName */ "@/views/Dashboard/Customer/Home/DataBounty")
    },

    {
      path: "payment/history",
      name: "customer-payment-history",
      meta: { pageHeader: "Payment History" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/PaymentHistory")
    },
    {
      path: "payment/details",
      name: "customer-payment-details",
      meta: { pageHeader: "Payment details", parent: "customer-payment-details" },
      component: () => import(/* webpackChunkName */ "../../views/Dashboard/Customer/Home/PaymentHistory/Details")
    }
  ]
}]

export default customerRoutes
