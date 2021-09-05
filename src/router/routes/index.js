const indexRoutes = [{
    path: '/',
    component: () => import(/* webpackChunkName */ '../../views/LandingPage/Layout'),
    children: [
      {
        path: '/',
        name: 'landing-page',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage'),
      },
      {
        path: '/generate',
        name: 'generate-account',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/GenerateAccount'),
      },
      {
        path: '/generate',
        name: 'generate-mnemonic',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/GenerateAccount/GenerateMnemonic'),
      },
      {
        path: '/generate',
        name: 'verify-mnemonic',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/GenerateAccount/VerifyMnemonic'),
      },
      {
        path: '/generate',
        name: 'set-password',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/GenerateAccount/SetPassword'),
      },
      {
        path: '/generate',
        name: 'registration-successful',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/GenerateAccount/RegistrationSuccessful'),
      },
    ]
  },
]
  
export default indexRoutes