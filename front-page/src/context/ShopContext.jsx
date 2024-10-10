import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [token,setToken] = useState('');
    const navigate = useNavigate();

    

    const addToCart = async (itemId,size) => {

        if (!size) {
            toast.error('select product size');
            return;
        }

        let cartData = structuredClone(cartItems);  // we save the cartItems to cartData

        if (cartData[itemId]) {
            // the cartData have any props avail with itemID
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
                // the cartData have any product with itemID and the size increase the product by1
            }
            else{
                cartData[itemId][size] = 1;
                // if we have the a product entry but we don't have with the same size we create a new entry
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
            // if we don't have any particular item with the itemId create a new entry
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers: {token}})

            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () =>{
        let totalCount = 0;
        for (const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity)=>{
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {

            try {

                await  axios.post(backendUrl + '/api/cart/update', {itemId,size,quantity}, {headers: {token}})
                
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }

        }
    } 
    // here is to remove from cart cart

    const getCartAmount =  () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((products)=> products._id === items ); // here we compare
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item]> 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    } // here is the logic to calculate the total cart 

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            
            if (response.data.success) {
                setProducts(response.data.product)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(response.data.message)
        }
    }

    const getUserCart = async (token) =>{
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers: {token}})

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }

        } catch (error) {
            console.log(error);
            toast.error(response.data.message)
        }
    }

    useEffect(()=>{
        getProductsData()
    },[])


    useEffect(()=>{
        if (!token && localStorage.getItem('token') ) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    },[])

    const value = {
        products, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        addToCart,cartItems,getCartCount,
        updateQuantity, getCartAmount, setCartItems,
        navigate, backendUrl, setToken, token,
    }
    
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;