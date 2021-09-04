const indexRoutes = [{
    path: '/',
    component: () => import(/* webpackChunkName */ '../../views/LandingPage/Layout'),
    children: [
      {
        path: '/',
        name: 'landing-page',
        meta: {
          pageHeader: 'LandingPage',
        },
        component: () => import(/* webpackChunkName */ '../../views/LandingPage'),
      },
    ]
  },
]
  
export default indexRoutes