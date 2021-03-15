import Agent from '../../utils/Agent'
import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';

// checkUser: (address) =>
//     Agent.Request.get('/user/sign-up/username/checker?username=' + address, {}),
// register: (address, data, sig, chainId, networkId) =>
//     Agent.Request.post('/user/metamask/sign-up', { address, data, sig, chainId, networkId }),
// login: (address, data, sig, chainId, networkId) =>
//     Agent.Request.post('/user/metamask/login', { address, data, sig, chainId, networkId }),
// logOut: () => {
//     /**
//      * delete token
//      * disconnect metamask
//      */
//     console.log('logOut!')
// }

export const authService = {
    logIn,
    logOut,
    signUp,
    checkUser
};

function checkUser(address) {
    return Agent.Request.get(Url.CHECK_USER, { address })
}

function signUp(payload) {
    try {
        return Agent.Request.post(Url.SIGN_UP, payload )
    } catch(error) {
        return error
    }
}

function logIn(address, data, sig, chainId, networkId) {
    return Agent.Request.post(Url.LOGIN, { address, data, sig, chainId, networkId })
}

function logOut() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
