import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGOUT,
    REGISTER,
    CHECK_EXIST
} from '../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case REGISTER:
            return {
                registered: action.success
            }
        case CHECK_EXIST:
            return {
                registered: action.success
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
