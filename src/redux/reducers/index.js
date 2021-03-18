import { combineReducers } from 'redux';
import wallet from './wallet';
import { pool } from './pool';
import swap from './swap';
import { auth } from './auth'
import { alert } from './alert'

const rootReducer = combineReducers({
    auth,
    swap,
    pool,
    wallet,
    alert
});

export default rootReducer;
