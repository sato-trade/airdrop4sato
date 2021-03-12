import { combineReducers } from 'redux';
import wallet from './wallet';
import pool from './pool';
import swap from './swap';
import auth from './auth'

export default combineReducers({ wallet, swap, pool, auth });
