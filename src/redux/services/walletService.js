import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';
import { handleResponse } from '../../utils/HandleResponse'

export const walletService = {
    getUserCapital,
    withdraw,
    // deposit
};

async function getUserCapital(token) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(token),
    };
    return fetch(Url.GET_USER_CAPITAL, requestOptions).then(handleResponse);
}

async function withdraw(payload) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(payload.token),
        body: JSON.stringify(payload)
    };
    return fetch(Url.WITHDRAW, requestOptions).then(handleResponse);
}

// async function deposit(payload) {
//     const requestOptions = {
//         method: 'POST',
//         headers: authHeader(payload.token),
//         body: JSON.stringify(payload)
//     };
//     return fetch(Url.DEPOSIT, requestOptions).then(handleResponse);
// }
