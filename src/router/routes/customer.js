import { checkIsLoggedIn } from '@/common/lib/route-guard'

const customerRoutes = [{
    path: '/customer',
    component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Layout'),
    beforeEnter: checkIsLoggedIn,
    children: [
      {
        path: '/',
        name: 'customer-dashboard',
        component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer'),
      },
    ]
  },
]
  
export default customerRoutes