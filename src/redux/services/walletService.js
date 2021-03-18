import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';
import { handleResponse } from '../../utils/HandleResponse'

export const poolService = {
    withdraw,
    deposit
};

async function withdraw(payload) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(payload.token),
        body: JSON.stringify(payload)
    };
    return fetch(Url.WITHDRAW, requestOptions).then(handleResponse);
}

async function deposit(payload) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(payload.token),
        body: JSON.stringify(payload)
    };
    return fetch(Url.DEPOSIT, requestOptions).then(handleResponse);
}
