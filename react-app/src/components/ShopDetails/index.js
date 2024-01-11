import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { thunkGetShop } from '../../store/shops'
import ShopDetailsProfile from './ShopDetailsProfile'
import ShopDetailsNav from './ShopDetailsNav'
import ShopDetailsCritters from './ShopDetailsCritters'
import ShopDetailsAbout from './ShopDetailsAbout'
// import ShopDetailsReviews from './ShopDetailsReviews'
import "./ShopDetails.css"
import { getShopCritters } from '../../store/critters'
import Loading from '../Loading'

export default function ShopDetails() {
    const {shopId} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const shop = useSelector(state => state.shops[shopId])
    const sessionUser = useSelector(state => state.session.user)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isOwner, setIsOwner] = useState(sessionUser && sessionUser.id===shop?.userId)

    useEffect(() => {
        setIsOwner(sessionUser && sessionUser.id===shop?.userId)
    }, [sessionUser, shop])

    useEffect(() => {
        if (!isLoaded && !shop?.coverImageUrl) {
            dispatch(thunkGetShop(shopId))
                .then(res => {
                    if (res.status===404) {
                        history.push('/not-found')
                        return ""
                    }
                    return res;
                })
                .then(res => res ? dispatch(getShopCritters(res.critters)) : null)
                .then(() => setIsLoaded(true));
        } else setIsLoaded(true);
    }, [shop, shopId, dispatch, history, isLoaded])

    // shop? - could error if deleting shop from shop page
    if (!isLoaded || !shop?.critters) return <Loading text="Loading Shop" />

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
            <ShopDetailsProfile shop={shop} isOwner={isOwner}/>
            <ShopDetailsNav shop={shop}/>
            <ShopDetailsCritters shop={shop}/>
            <ShopDetailsAbout shop={shop} isOwner={isOwner}/>
            {/* <ShopDetailsReviews shop={shop}/> */}
        </div>
    )
}
