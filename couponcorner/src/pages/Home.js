import React from 'react'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../slices/authSlice"
import { toast } from "react-hot-toast"
import { apiConnector } from '../Services/apiconnector';
import Product from '../Components/Product';


function Home() {
    //const BASE_URL="http://localhost:4000/api/v1/"
   const GET_ALL_COUPON_API="http://localhost:4000/api/v1/coupon/getALLCoupon"
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth)
    const { loading } = useSelector((state) => state.profile)
    const [result,setResult]=useState(null);

   // useEffect(() => {
  //    if (!token) {
   //     navigate("/signup");
  // //   }
   // }, []);

    useEffect(() => {
       getAllCoupons()
      },[]);
      
   
       const getAllCoupons = async () => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
          const response = await apiConnector("GET", GET_ALL_COUPON_API)
          if (!response?.data?.success) {
            throw new Error("Could Not Fetch Course Categories")
          }
          setResult(response?.data?.data)
          console.log(result)
        } catch (error) {
          console.log("GET_ALL_COURSE_API API ERROR............", error)
          toast.error(error.message)
        }
        toast.dismiss(toastId)   
        dispatch(setLoading(false))
      }
      
  return (
    <div>
      {
      loading ? (
        <div className="spinner"></div>
      )
      :
      (
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5
        gap-y-8 max-w-6xl p-6 mx-auto my-7 min-h-[80vh]">
        {result ? (
          result.map(item => (
          <Product  key ={item.id} post={item} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
     
      )
      }
    </div>
  )
}

export default Home