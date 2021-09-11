const signInRoutes = [
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
  {
    path: '/sign-in',
    name: 'change-password-successful',
    component: () => import(/* webpackChunkName */ '../../views/LandingPage/SignIn/ChangePasswordSuccessful'),
  },
]

export default signInRoutes