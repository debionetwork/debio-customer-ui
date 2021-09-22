import { checkIsLoggedIn } from '@/common/lib/route-guard'

const customerRoutes = [{
    path: '/customer',
    component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Layout'),
    beforeEnter: checkIsLoggedIn,
    children: [
      {
        path: '/',
        name: 'customer-dashboard',
        meta: {
          pageHeader: 'Home',
          drawerButtons: [
            { text: "Dashboard", disabled: false, active: true, route: { name: "customer-home" }, img: "@/assets/grid.png" },
            { text: "My Test", disabled: false, active: false, route: { name: "" }, img: "@/assets/box.png" },
            { text: "My EMR", disabled: false, active: false, route: { name: ""}, img: "@/assets/file-text.png" },
            { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" },
          ]
        },
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer'),
      },
      {
        path: '/customer/request-test',
        name: 'request-test',
        meta: {
          pageHeader: 'Request Test',
          drawerButtons: [
            { text: "Dashboard", disabled: false, active: false, route: { name: "customer-home" }, img: "@/assets/grid.png" },
            { text: "My Test", disabled: false, active: true, route: { name: "" }, img: "@/assets/box.png" },
            { text: "My EMR", disabled: false, active: false, route: { name: ""}, img: "@/assets/file-text.png" },
            { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" },
          ]
        },
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTest'),
      },
      {
        path: '/customer/request-test/select-lab',
        name: 'select-lab',
        meta: {
          pageHeader: 'Select Lab',
          drawerButtons: [
            { text: "Dashboard", disabled: false, active: false, route: { name: "customer-home" }, img: "@/assets/grid.png" },
            { text: "My Test", disabled: false, active: true, route: { name: "" }, img: "@/assets/box.png" },
            { text: "My EMR", disabled: false, active: false, route: { name: ""}, img: "@/assets/file-text.png" },
            { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" },
          ]
        },
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/SelectLab'),
      },
      {
        path: '/customer/request-test/select-lab/checkout',
        name: 'request-test-checkout',
        meta: {
          pageHeader: 'Checkout',
          drawerButtons: [
            { text: "Dashboard", disabled: false, active: false, route: { name: "customer-home" }, img: "@/assets/grid.png" },
            { text: "My Test", disabled: false, active: true, route: { name: "" }, img: "@/assets/box.png" },
            { text: "My EMR", disabled: false, active: false, route: { name: ""}, img: "@/assets/file-text.png" },
            { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" },
          ]
        },
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/RequestTestCheckout'),
      },
      {
        path: '/customer/request-test/select-lab/checkout/payment',
        name: 'request-test-payment',
        meta: {
          pageHeader: 'Payment',
          drawerButtons: [
            { text: "Dashboard", disabled: false, active: false, route: { name: "customer-home" }, img: "@/assets/grid.png" },
            { text: "My Test", disabled: false, active: true, route: { name: "" }, img: "@/assets/box.png" },
            { text: "My EMR", disabled: false, active: false, route: { name: ""}, img: "@/assets/file-text.png" },
            { text: "Order History", disabled: false, active: false, route: { name: "" }, img: "@/assets/credit-card.png" },
          ]
        },
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/PaymentPage'),
      },
    ]
  },
]


export default customerRoutes