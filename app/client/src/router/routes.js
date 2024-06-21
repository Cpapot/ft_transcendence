
import Views from '@views';

/**
 * Route configuration
 * 
 * @param {string} path - The URL path (required)
 * @param {object} component - The view to render (required)
 * @param {boolean} [extend=false] - If the view should be extended (optional)
 * @param {boolean} [auth=false] - If the view requires authentication (optional)
 * @param {string} [require_params] - If the view requires parameters (optional)
 * @param {string} [require_storage] - If the view requires storage (optional)
*/

const authRoutes = [
    { path: '/two_factor_authentication', component: Views.Twofa, extend: true, auth: true},
    { path: '/two_factor_authentication_code', component: Views.TwofaCode, extend: true, auth: true },
    { path: '/profile', component: Views.Profile, auth: true },
    { path: '/multiplayer', component: Views.Multiplayer, auth: true },
    { path: '/tournament', component: Views.Tournament, auth: true },
    { path: '/lobby', component: Views.Lobby, extend: true, auth: true }
];

const NoAuthRoutes = [
    { path: '/auth', component: Views.Auth, extend: true, auth: false },
    { path: '/oauth', component: Views.OAuth, extend: true, auth: false },
    { path: '/auth/login', component: Views.Login, extend: true, require_storage: 'TEMPAuthEmail', auth: false },
    { path: '/auth/register', component: Views.Register, extend: true, require_storage: 'TEMPAuthEmail', auth: false },

    { path: '/forgot-password', component: Views.Forgot, extend: true, require_storage: 'TEMPAuthEmail', auth: false },
    { path: '/send-email', component: Views.Send, extend: true, auth: false },
    { path: '/reset-password', component: Views.Reset, extend: true, require_params: ['reset_code'],auth: false },
];

const publicRoutes = [
    { path: '/', component: Views.Home },
    { path: '/training', component: Views.Training },
    { path: '/game', component: Views.Game, extend: true },
    { path: '/privacy', component: Views.Privacy },
    { path: '/error', component: Views.Error }
];

export default [
    ...authRoutes,
    ...NoAuthRoutes,
    ...publicRoutes
];