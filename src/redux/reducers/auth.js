import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGOUT,
    REGISTER,
    CHECK_EXIST,
    NOT_REGISTERED,
    REGISTERED,
    FETCH_POSTS
} from '../constants';

export function auth (state = {}, action) {
    switch (action.type) {
        case FETCH_POSTS:
            return {
                test: action.success
            }
        case REGISTER:
            return {
                registered: action.success
            }
        case CHECK_EXIST:
            return {
                registered: true
            }
        case NOT_REGISTERED:
            return {
                registered: false
            }
        case REGISTERED:
            return {
                registered: true
            }
        case LOGIN:
            return {
                ...state,
                loggingIn: false,
                errors: action.error ? action.payload.errors : null
            };
        case LOGIN_SUCCESSFUL:
            return {
                loggedIn: true,
                loggingIn: false
            };
        case LOGIN_FAILED:
            return {
                loggedIn: false,
                loggingIn: false,
                errors: action.error ? action.payload.errors : null
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
