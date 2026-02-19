import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../slice/common/registerSlice";
import loginReducer from "../slice/common/loginSlice";
import profileReducer from "../slice/user/profileSlice";
import usersReducer from "../slice/admin/usersSlice";
import addProductReducer from "../slice/admin/addProductSlice";
import allProductsReducer from "../slice/admin/allProductsSlice";
import userHomeReducer from "../slice/user/userHomeSlice";
import productDetailsReducer from "../slice/user/productDetailsSlice";
import paymentReducer from "../slice/user/paymentSlice";

import myOrdersReducer from "../slice/user/myOrdersSlice";

import adminOrdersReducer from "../slice/admin/ordersSlice";
import adminHomeReducer from "../slice/admin/adminHomeSlice";

const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    profile: profileReducer,
    adminUsers: usersReducer,
    addProduct: addProductReducer,
    allProducts: allProductsReducer,
    userHome: userHomeReducer,
    productDetails: productDetailsReducer,
    payment: paymentReducer,
    myOrders: myOrdersReducer,
    adminOrders: adminOrdersReducer,
    adminHome: adminHomeReducer,
  },
});

export default store;
