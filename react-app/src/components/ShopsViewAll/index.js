import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import {thunkGetAllShops} from '../../store/shops.js'
import ShopCard from '../ShopCard/index.js'
import "./ShopsViewAll.css"

export default function ShopsViewAll() {
    const dispatch = useDispatch();
    const shops = Object.values(useSelector(state => state.shops))

    useEffect(() => {
        dispatch(thunkGetAllShops())
    }, [dispatch])

    if (!shops) return <div>Loading All Shops...</div>

    return (
        <div className='all-shops-container'>
            {/* <div>Categories List</div> */}
            <h1>Browse Shops Near You</h1>
            <div className='all-shops-list'>
            {shops.map((shop) => (
                <div key={shop.id}>
                    <ShopCard shop={shop}/>
                </div>
            ))}
            </div>
        </div>
    )
}
