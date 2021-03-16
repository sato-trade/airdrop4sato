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
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(Url.CHECK_USER + address, requestOptions).then(handleResponse);
}

async function signUp(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(Url.SIGN_UP, requestOptions).then(handleResponse);

}

function logIn(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(Url.LOGIN, requestOptions).then(handleResponse);
}

function logOut() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logOut();
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

