import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { thunkGetShop } from '../../store/shops'
import ShopDetailsProfile from './ShopDetailsProfile'
import ShopDetailsNav from './ShopDetailsNav'
import ShopDetailsCritters from './ShopDetailsCritters'
import ShopDetailsAbout from './ShopDetailsAbout'
import ShopDetailsReviews from './ShopDetailsReviews'
import "./ShopDetails.css"
import { getShopCritters } from '../../store/critters'

export default function ShopDetails() {
    const {shopId} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const shop = useSelector(state => state.shops[shopId])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!shop?.coverImageUrl) {
            dispatch(thunkGetShop(shopId))
                .then(res => {
                    if (res.status===404) {
                        history.push('/not-found')
                    }
                    return res;
                })
                .then(res => dispatch(getShopCritters(res.critters)))
                .then(() => setIsLoaded(true));
        } else setIsLoaded(true);
    }, [shop, shopId, dispatch, history, isLoaded])

    if (!isLoaded) return <div>Loading Shop...</div>

    // const {name,
    //     address,
    //     city,
    //     state,
    //     zipCode,
    //     priceRange,
    //     businessHours,
    //     email,
    //     phoneNumber,
    //     description,
    //     coverImageUrl,
    //     businessImageUrl,
    //     pickup,
    //     delivery,
    // } = shop

    return (
        <div className='shop-details-container'>
            <ShopDetailsProfile shop={shop}/>
            <ShopDetailsNav shop={shop}/>
            <ShopDetailsCritters shop={shop}/>
            <ShopDetailsAbout shop={shop}/>
            <ShopDetailsReviews shop={shop}/>
        </div>
    )
}
