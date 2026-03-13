import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices"; 
import productReducer from "./slices/ProductSlice"
import cartReducer from "./slices/CartSlice";
import checkoutReducer from "./slices/CheckOutSlice";
import orderReducer from "./slices/OrderSlice";
import adminReducer from "./slices/AdminSlice";
import adminProductReducer from "./slices/adminProductSlice"
import adminOrderReducer from "./slices/AdminOrderSlice"
const store = configureStore({
  reducer: {
    auth: authReducer, 
    product : productReducer,
    cart : cartReducer,
    checkout : checkoutReducer,
    order : orderReducer,
    admin : adminReducer,
    adminProduct : adminProductReducer,
    adminOrder : adminOrderReducer
  },
});

export { store };
