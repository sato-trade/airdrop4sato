import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';
import { handleResponse } from '../../utils/HandleResponse'

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



