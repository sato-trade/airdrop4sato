import {
    ADD_LIQUIDITY, ADD_SUCCEED, ADD_FAILED, REMOVE_LIQUIDITY, REMOVE_SUCCEED, REMOVE_FAILED
} from '../constants';

export function pool (state = {}, action) {
    switch (action.type) {
        case ADD_LIQUIDITY:
            return {
                loading: true
            }
        case ADD_SUCCEED:
            return {
                message: action
            }
        case ADD_FAILED:
            return {
                message: action.message
            }
        case REMOVE_LIQUIDITY:
            return {
                loading: true
            }
        case REMOVE_SUCCEED:
            return {
                message: action
            }
        case REMOVE_FAILED:
            return {
                message: action.message
            }
        default:
            return state;
    }

    return state;
};
