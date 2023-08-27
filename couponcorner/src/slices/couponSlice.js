import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
}

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload
    },
    setEditCoupon: (state, action) => {
      state.editCoupon = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetCouponState: (state) => {
      state.step = 1
      state.coupon = null
      state.editCoupon = false
    },
  },
})

export const {
  setStep,
  setCoupon,
  setEditCoupon,
  setPaymentLoading,
  resetCouponState,
} = couponSlice.actions

export default couponSlice.reducer