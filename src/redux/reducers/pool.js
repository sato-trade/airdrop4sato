import {
    ADD_LIQUIDITY, ADD_SUCCEED, ADD_FAILED, REMOVE_LIQUIDITY, REMOVE_SUCCEED, REMOVE_FAILED
} from '../constants';

export function pool (state = {}, action) {
    switch (action.type) {
        case ADD_LIQUIDITY:
            return {
                ...state,
                loading: true
            }
        case ADD_SUCCEED:
            return {
                ...state,
                message: action
            }
        case ADD_FAILED:
            return {
                ...state,
                message: action.message
            }
        case REMOVE_LIQUIDITY:
            return {
                ...state,
                loading: true
            }
        case REMOVE_SUCCEED:
            return {
                ...state,
                message: action
            }
        case REMOVE_FAILED:
            return {
                ...state,
                message: action.message
            }
        default:
            return state;
    }

    return state;
};
