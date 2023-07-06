import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { customerReducer } from './customerSlice';
import authReducer from './authSlice';
import { vendorReducer } from './vendorSlice';
import { branchReducer } from './branchSlice';
import { inventoryTypeReducer } from './inventoryTypeSlice';
import { roleReducer } from './roleSlice';
import inventoryDetailReducer from './inventoryDetailSlice'
import { inventoryBrandReducer } from './inventoryBrandSlice';
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
  inventoryBrand:inventoryBrandReducer,
  inventoryDetail:inventoryDetailReducer,
  roles:roleReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
