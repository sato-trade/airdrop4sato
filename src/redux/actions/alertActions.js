import { SUCCESS, ERROR, CLEAR } from '../_constants';

export const alertActions = {
    success,
    error,
    clear
};

function success(message) {
    return { type: SUCCESS, message };
}

function error(message) {
    return { type: ERROR, message };
}

function clear() {
    return { type: CLEAR };
}
