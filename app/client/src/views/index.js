
import Profile from './account/account.js';

import Login from './auth/base/login.js';
import Register from './auth/base/register.js';

import Forgot from './auth/reset/forgot.js';
import Reset from './auth/reset/reset.js';
import Send from './auth/reset/send_email.js';

import Auth from './auth/auth.js';
import OAuth from './auth/oauth.js';
import Twofa from './auth/twofa.js';
import TwofaCode from './auth/twofaCode.js'

import Error from './error/error.js';

import Game from './game/base/gameSetup.js';
import Lobby from './game/tournaments/lobby.js';
import Tournament from './game/tournaments/tournament.js';
import Multiplayer from './game/multiplayer.js';
import Training  from './game/training.js';

import Home from './home/home.js';

import AuthNotification from './notification/authNotification.js';

import Privacy from './privacy/privacy.js';

const Views = {
    // Account
    Profile,
    // Auth
    Login, Register, Forgot, Reset, Send, Auth, OAuth, Twofa, TwofaCode,
    // Error
    Error,
    // Game
    Game, Lobby, Tournament, Multiplayer, Training,
    // Home
    Home,
    // Notification
    AuthNotification,
    // Privacy
    Privacy
};

export default Views;