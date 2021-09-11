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
      {
        path: '/select-role',
        name: 'select-role',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/SelectRole'),
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/SignIn'),
      },
      {
        path: '/sign-in',
        name: 'forgot-password',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/SignIn/ForgotPassword'),
      },
      {
        path: '/sign-in',
        name: 'import-keystore',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/SignIn/ImportKeystore'),
      },
      {
        path: '/sign-in',
        name: 'input-mnemonic',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/SignIn/InputMnemonic'),
      },
      {
        path: '/sign-in',
        name: 'change-password',
        component: () => import(/* webpackChunkName */ '../../views/LandingPage/SignIn/ChangePassword'),
      },
    ]
  },
]
  
export default indexRoutes