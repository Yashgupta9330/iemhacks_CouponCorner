
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {addToCart ,removeFromCart} from "../slices/cartSlice";

const Product = ({post}) => {

  const {cart} = useSelector((state) => state.cart);
  const dispatch = useDispatch();

 //const add = () => {
 //   dispatch(addToCart(post));
 //   toast.success("Item added to Cart");
  //}

 // const remove= () => {
//    dispatch(removeFromCart(post.id));
//    toast.error("Item removed from Cart");
 // }

  return (
    <div className="flex flex-col items-center justify-between w-full gap-3 p-4 rounded-xl 
    border-2 border-[#00095] shadow-lg hover:shadow-2xl hover:scale-[1.03]
    md:hover:scale-[1.05] transition ease-in">
      <div>
        <p className="text-[#1d783e] font-semibold text-lg text-left truncate w-40 mt-1">
          {post.couponName}
        </p>
      </div>
      <div>
        <p className="w-40 text-gray-400 font-normal text-[10px] text-left">
          {post.couponDescription}
        </p>
      </div>
      <div className="h-[180px]">
        <img src={post.thumbnail} className="h-full w-full" alt=""/>
      </div>

      <div className="flex justify-between items-center w-full mt-5">
        <div>
          <p className="text-green-600 font-semibold">${post.price}</p>
        </div>
        
        {
          cart.find(item => item.id === post._id) ?
          (<button
          className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold 
          text-[12px] p-1 px-3 uppercase 
          hover:bg-gray-700
          hover:text-white transition duration-300 ease-in"
          onClick={() => dispatch(removeFromCart(post._id))}>
            Remove from cart
          </button>) :
          (<button
          className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold 
          text-[12px] p-1 px-3 uppercase 
          hover:bg-gray-700
          hover:text-white transition duration-300 ease-in"
          onClick={() => dispatch(addToCart(post))}>
            Add to Cart
          </button>)
        }
      </div>
     

    </div>
  );
};

export default Product;