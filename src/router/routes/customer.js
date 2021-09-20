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
    ]
  },
]

export default customerRoutes