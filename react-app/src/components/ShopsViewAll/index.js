import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import {thunkGetAllShops} from '../../store/shops.js'
import ShopCard from '../ShopCard/index.js'

export default function ShopsViewAll() {
    const dispatch = useDispatch();
    const shops = Object.values(useSelector(state => state.shops))

    useEffect(() => {
        dispatch(thunkGetAllShops())
    }, [dispatch])

    if (!shops) return <div>Loading All Shops...</div>

    return (
        <div>
            <div>Categories List</div>
            {shops.map((shop) => (
                <div key={shop.id}>
                    <ShopCard shop={shop}/>
                </div>
            ))}
        </div>
    )
}
