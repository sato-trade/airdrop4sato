import {
    LOGIN,
    LOGIN_SUCCEED,
    LOGIN_FAILED,
    LOGOUT,

    SIGNUP,
    SIGNUP_SUCCEED,
    SIGNUP_FAILED,


    CHECK_EXIST,
    CHECK_SUCCEED,
    CHECK_FAILED,

    AUTH_SIGNING
} from '../constants';

export function auth (state = {
    loggedIn: false,
    loggingIn: false,
    loading: false,
    registered: false,
    authMsg: ''
}, action) {
    switch (action.type) {
        case AUTH_SIGNING:
            return {
                ...state,
                loading: true
            }
        case SIGNUP:
            return {
                ...state,
                loading: true,
                authMsg: ''
            }
        case SIGNUP_SUCCEED:
            return {
                ...state,
                registered: true,
                loading: false
            }
        case SIGNUP_FAILED:
            return {
                ...state,
                authMsg: action.message,
                loading: false
            }
        case CHECK_EXIST:
            return {
                ...state,
                loading: true,
                authMsg: ''
            }
        case CHECK_SUCCEED:
            return {
                ...state,
                registered: action.registered,
                loading: false
            }
        case CHECK_FAILED:
            return {
                ...state,
                authMsg: '',
                loading: false
            }
        case LOGIN:
            return {
                ...state,
                loggingIn: true,
                authMsg: '',
                errors: action.error ? action.payload.errors : null
            };
        case LOGIN_SUCCEED:
            return {
                ...state,
                loggedIn: true,
                loggingIn: false,
                registered: true,
                token: action.data.data,
                address: action.data.address,
                networkId: action.data.networkId,
                chainId: action.data.chainId
            };
        case LOGIN_FAILED:
            return {
                ...state,
                loggedIn: false,
                loggingIn: false,
                errors: action,
                authMsg: action.message,
                loading: false
            };
        case LOGOUT:
            return {
                ...state,
                loggedIn: false,
                token: '',
                loading: false
            }
        default:
            return state;
    }

    return state;
};
