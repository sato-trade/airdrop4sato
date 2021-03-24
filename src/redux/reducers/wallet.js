import {
    GET_USER_CAPITAL,
    GET_USER_CAPITAL_FAILED,
    GET_USER_CAPITAL_SUCCEED,
    WITHDRAW,
    WITHDRAW_FAILED,
    WITHDRAW_SUCCEED,
    DEPOSIT,
    DEPOSIT_FAILED,
    DEPOSIT_SUCCEED,
    GET_ALL_TOKEN_STATUS, GET_ALL_TOKEN_STATUS_SUCCEED, GET_ALL_TOKEN_STATUS_FAILED
} from '../constants';

export function wallet (state = {
    userCapitals: [],
    tokenList: []
}, action) {
    console.log('action: ', action)
    switch (action.type) {
        case GET_USER_CAPITAL:
            return {
                ...state,
                loading: true
            }
        case GET_USER_CAPITAL_SUCCEED:
            return {
                ...state,
                userCapitals: action.data,
                loading: false
            }
        case GET_USER_CAPITAL_FAILED:
            return {
                ...state,
                message: action.message,
                loading: false
            }
        case GET_ALL_TOKEN_STATUS:
            return {
                ...state,
                loading: true
            }
        case GET_ALL_TOKEN_STATUS_SUCCEED:
            return {
                ...state,
                tokenList: action.data,
                loading: false
            }
        case GET_ALL_TOKEN_STATUS_FAILED:
            return {
                ...state,
                message: action.message,
                loading: false
            }
        default:
            return state;
    }

    return state;
};
