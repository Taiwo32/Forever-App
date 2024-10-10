import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProduct] = useState([]);

    useEffect(()=>{
        setLatestProduct(products.slice(0,10));
    },[products])

    // we get the products from the context cos we pass it there already we save the products in the state variable 
    // we added the productItem cos we need the property where we styled it, it makes the code clean and clear
    
  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'LATEST'}  text2={'COLLECTIONs'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam delectus, cum, voluptatum quam enim quas, tempore eum dolorem deserunt expedita rem perspiciatis neque veritatis minima velit. Tempore magni ea aperiam.
            </p>
        </div>

        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 '>
            {
                latestProducts.map((item,index)=>(
                   <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} /> 
                ))
            }
        </div>


    </div>
  )
}

export default LatestCollection