const customerRoutes = [{
    path: '/customer',
    component: () => import(/* webpackChunkName */ '../../views/Dashboard/Customer/Layout'),
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