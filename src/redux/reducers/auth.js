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
} from '../constants';

export function auth (state = {}, action) {
    console.log('action here: ', action)
    switch (action.type) {
        case SIGNUP:
            return {
                loading: true
            }
        case SIGNUP_SUCCEED:
            return {
                registered: action.success
            }
        case SIGNUP_FAILED:
            return {
                message: action.message
            }
        case CHECK_EXIST:
            return {
                loading: true
            }
        case CHECK_SUCCEED:
            return {
                registered: action.registered
            }
        case CHECK_FAILED:
            return {
                message: action
            }
        case LOGIN:
            return {
                ...state,
                loggingIn: true,
                errors: action.error ? action.payload.errors : null
            };
        case LOGIN_SUCCEED:
            return {
                loggedIn: true,
                loggingIn: false,
                registered: true,
                token: action.data
            };
        case LOGIN_FAILED:
            return {
                loggedIn: false,
                loggingIn: false,
                errors: action
            };
        case LOGOUT:
            return {
                loggedIn: false
            }
        default:
            return state;
    }

    return state;
};
