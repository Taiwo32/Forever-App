import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const {products, search, showSearch,} = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType,setSortType] = useState('relevant')

    const toggleCategory = (e) =>{

        if (category.includes(e.target.value)) {
            setCategory(prev=> prev.filter(item => item !== e.target.value))
            // if the category is true we have to filter i.e [get the part of -->] the product if it is not it will be remove from the category array
        }
        else{
            setCategory(prev => [...prev,e.target.value])
            // if it is false it mean the category is not in that array and the spread operator to add the new entry to that array
        }
    }
    
    const toggleSubCategory = (e) =>{
        
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev=> prev.filter(item => item !== e.target.value))
            // if the subCategory includes e.target.value it will remove it or else we add the new entry with spread operator
        }
        else{
            setSubCategory(prev => [...prev,e.target.value])
            //or else we add the new entry with spread operator
        }
    }
    
    const applyFilter = () => {

        let productsCopy = products.slice();
        // here the products that we have in our context is saved in the productCopy variable 

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase())); 
            // if the showSearch and search is true get the products by the search, we include the lowerCase so everything there will be in lowerCase and we can get it in lowerCase
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        } 
        // if category.length it means we have selected any category in that case we use the productCopy. filter method
        // if the category os available we will save it else we will remove it 
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
        }

        setFilterProducts(productsCopy)
        // here we pass the productsCopy inside the setFilterProducts state 
    }

    const sortProduct = () =>{

       let fpCopy = filterProducts.slice();
       
       switch (sortType) {
        case 'low-high':
            setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price))); // here we compare low to high show the products from the lower price to the high price
            break;
        case 'high-low':
            setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price))); // here we compare high to low show the products from the higher price to the low price
            break;
        default:
          applyFilter();
          break; 
       }  // the default just display the applyFilter
    }

    useEffect(()=>{
        applyFilter();
    },[category,subCategory,search,showSearch,products])

    useEffect(()=>{
        sortProduct();
    },[sortType])
    
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

        {/* filter Options */}
        <div className='min-w-60'>
            <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
              <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90 ': ""}`} src={assets.dropdown_icon} alt="" />
            </p>
            {/* filter Options for the big screen show the filters options and on the small screen hidden but on clicking on the small screen make it visible, also if it is visible on clicking on it make it not visible  */}
            {/* Category filter  */}
            <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                <p className='mb-3 text-sm font-medium '>CATEGORIES</p>
                <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
                    </p>
                </div>
            </div>
            {/* SubCategory filter  */}
            <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '': 'hidden'} sm:block`}>
                <p className='mb-3 text-sm font-medium '>TYPE</p>
                <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} /> Top wear
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottom wear
                    </p>
                    <p className='flex gap-2'>
                        <input className='w-3' type="checkbox" value={'Winterwear'}  onChange={toggleSubCategory}/> Winter Wear
                    </p>
                </div>
            </div>
        </div>
        {/* RIGHT SIDE   */}
        <div className='flex-1'>
            <div className='flex justify-between text-base sm:text-2xl mb-4'>
                <Title text1={'ALL'} text2={'COLLECTIONS'} />
                {/* Product Sort  */}
                <select onChange={(e)=> setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 '>
                    <option value="relevant">Sort by: Relevant</option>
                    <option value="low-high">Sort by: Low to High</option>
                    <option value="high-low">Sort by: High to Low</option>
                </select>

            </div>
            {/* map product  */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                {
                    filterProducts.map((item,index)=>(
                        <ProductItem key={index} name={item.name} id={item._id} image={item.image} price={item.price} />
                    ))
                }
            </div>
        </div>

    </div>
  )
}

export default Collection