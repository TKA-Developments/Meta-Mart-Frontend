import { combineReducers } from '@reduxjs/toolkit'

import application from './application/reducers';
import web3Context from './global/web3SliceContext';

export const reducer = combineReducers({
  application,
  web3Context
});
