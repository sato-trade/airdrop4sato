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
    DEPOSIT_HASH,
    DEPOSIT_RECEIPT,
    GET_ALL_TOKEN_STATUS, GET_ALL_TOKEN_STATUS_SUCCEED, GET_ALL_TOKEN_STATUS_FAILED, GET_ALL_TOKEN_ICONS_SUCCEED,
    GET_L1_CAPITAL_SUCCEED, GET_L1_CAPITAL_FAILED, GET_TRANSACTION_RECORDS_FAILED, GET_TRANSACTION_RECORDS_SUCCEED,
    GET_AMPL_REWARDS_SUCCEED, GET_AMPL_REWARDS_FAILED,
    REGISTER_AMPL_REWARDS, REGISTER_AMPL_REWARDS_SUCCEED, NOT_QUALIFIED, ALREADY_REGISTERED,
    GET_WITHDRAW_FEE_SUCCESS, GET_WITHDRAW_FEE_FAILED
} from '../constants';

export function wallet (state = {
    userCapitals: [],
    tokenList: [],
    tokenIcons: {},
    l1Capital: [],
    depositFinished: true,
    depositSucceed: false,
    depositHash: '',
    depositReceipt: {},
    depositConfirmationNumber: 0,
    amplRewardsInfo: {
        totalRewards: 0,
        registeredUsers: 0,
        rewardsPerUser: 0,
        hasClaimed: null
    },
    message: '',
    withdrawFinished: true,
    withdrawSucceed: false,
    withdrawMsg: '',
    withdrawFeeObj: {
        amount: 0,
        base: ''
    },
}, action) {
    // console.log('action: ', action)
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
        case GET_ALL_TOKEN_ICONS_SUCCEED:
            return {
                ...state,
                tokenIcons: action.iconMaps
            }
        case GET_L1_CAPITAL_SUCCEED:
            return {
                ...state,
                l1Capital: action.data
            }
        case GET_ALL_TOKEN_STATUS_FAILED:
            return {
                ...state,
                message: action.message,
            }
        case WITHDRAW:
            return {
                ...state,
                withdrawFinished: false
            }
        case WITHDRAW_SUCCEED:
            return {
                ...state,
                withdrawFinished: true,
                withdrawSucceed: true,
                withdrawMsg: action.msg
            }
        case WITHDRAW_FAILED:
            return {
                ...state,
                withdrawFinished: true,
                withdrawSucceed: false,
                withdrawMsg: action.error
            }
        case DEPOSIT:
            return {
                ...state,
                depositFinished: false
            }
        case DEPOSIT_HASH:
            return {
                ...state,
                depositHash: action.hash
            }
        case DEPOSIT_RECEIPT:
            return {
                ...state,
                depositReceipt: action.receipt
            }
        case DEPOSIT_SUCCEED:
            return {
                ...state,
                depositFinished: true,
                depositSucceed: true,
                depositConfirmationNumber: action.confirmationNumber
            }
        case DEPOSIT_FAILED:
            return {
                ...state,
                depositFinished: true,
                depositSucceed: false,
                message: action.error
            }
        case GET_TRANSACTION_RECORDS_SUCCEED:
            return {
                ...state,
                transactionRecords: action.data.length > 0 ? action.data.reverse() : action.data
            }
        case GET_TRANSACTION_RECORDS_FAILED:
            return {
                ...state,
                message: action.error
            }

        case GET_AMPL_REWARDS_SUCCEED:
            return {
                ...state,
                message: '',
                amplRewardsInfo: action.data
            }
        case GET_AMPL_REWARDS_FAILED:
            return {
                ...state,
                amplRewardsInfo: action.data
            }
        case REGISTER_AMPL_REWARDS:
            return {
                ...state,
                message: '',
                loading: true
            }
        case REGISTER_AMPL_REWARDS_SUCCEED:
            return {
                ...state,
                loading: false
            }
        case NOT_QUALIFIED:
            return {
                ...state,
                message: action.message
            }
        case ALREADY_REGISTERED:
            return {
                ...state,
                message: action.message
            }
        case GET_WITHDRAW_FEE_SUCCESS:
            return {
                ...state,
                withdrawFeeObj: action.data
            }
        case GET_WITHDRAW_FEE_FAILED:
            return {
                ...state,
                message: action.message
            }
        default:
            return state;
    }

    return state;
};
