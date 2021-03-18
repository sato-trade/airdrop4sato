import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';
import { handleResponse } from '../../utils/HandleResponse'

export const poolService = {
    addLiquidity,
    removeLiquidity
};

async function addLiquidity(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(Url.ADD_LIQUIDITY, requestOptions).then(handleResponse);

}

async function removeLiquidity(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(Url.REMOVE_LIQUIDITY, requestOptions).then(handleResponse);

}
