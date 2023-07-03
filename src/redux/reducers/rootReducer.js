import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { customerReducer } from './customerSlice';
import authReducer from './authSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
