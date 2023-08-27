import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import cartReducer from "../slices/cartSlice"
import couponReducer from "../slices/couponSlice"


const rootReducer  = combineReducers({
     auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    coupon:couponReducer,

})

export default rootReducer