import {
    GET_USER_CAPITAL, GET_USER_CAPITAL_FAILED, GET_USER_CAPITAL_SUCCEED, WITHDRAW, WITHDRAW_FAILED, WITHDRAW_SUCCEED, DEPOSIT, DEPOSIT_FAILED, DEPOSIT_SUCCEED
} from '../constants';

export function wallet (state = {
    loggedIn: false,
    userCapitals: []
}, action) {
    console.log('action: ', action)
    switch (action.type) {
        case GET_USER_CAPITAL:
            return {
                loading: true
            }
        case GET_USER_CAPITAL_SUCCEED:
            return {
                userCapitals: action.data,
                loading: false
            }
        case GET_USER_CAPITAL_FAILED:
            return {
                message: action.message,
                loading: false
            }
        default:
            return state;
    }

    return state;
};
