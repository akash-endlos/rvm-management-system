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
import { problemReducer } from './problemSlice';
import { machineReducer } from './machineSlice';
import { localVendorReducer } from './localVendorSlice';
import { stockReducer } from './stockSlice';
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  vendor:vendorReducer,
  branch:branchReducer,
  inventoryType:inventoryTypeReducer,
  inventoryBrand:inventoryBrandReducer,
  inventory:inventoryDetailReducer,
  roles:roleReducer,
  problem:problemReducer,
  machine:machineReducer,
  localvendor:localVendorReducer,
  stock:stockReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
