import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { thunkGetShop } from '../../store/shops'
import ShopDetailsProfile from './ShopDetailsProfile'
import ShopDetailsNav from './ShopDetailsNav'
import ShopDetailsCritters from './ShopDetailsCritters'
import ShopDetailsAbout from './ShopDetailsAbout'
import ShopDetailsReviews from './ShopDetailsReviews'
import "./ShopDetails.css"

export default function ShopDetails() {
    const {shopId} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const shop = useSelector(state => state.shops[shopId])

    useEffect(() => {
        if (!shop?.coverImageUrl) {
            dispatch(thunkGetShop(shopId))
                .then(res => {
                    if (res.status===404) {
                        history.push('/not-found')
                    }
                })
        }
    }, [shop, shopId, dispatch, history])

    if (!shop?.coverImageUrl) return <div>Loading Shop...</div>

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
        <div>
            <ShopDetailsProfile shop={shop}/>
            <ShopDetailsNav shop={shop}/>
            <ShopDetailsCritters shop={shop}/>
            <ShopDetailsAbout shop={shop}/>
            <ShopDetailsReviews shop={shop}/>
        </div>
    )
}
