import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { customerReducer } from './customerSlice';
import authReducer from './authSlice';
import { vendorReducer } from './vendorSlice';
import { branchReducer } from './branchSlice';
import { inventoryTypeReducer } from './inventoryTypeSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  vendor:vendorReducer,
  branch:branchReducer,
  inventory:inventoryTypeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
