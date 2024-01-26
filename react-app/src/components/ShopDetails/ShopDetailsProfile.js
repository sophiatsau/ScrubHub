import React from 'react'
import ShopOwnerButtons from '../ShopCard/ShopOwnerButtons'

export default function ShopDetailsProfile({shop, isOwner}) {
    const {name,
        address,
        // city,
        // state,
        // zipCode,
        // priceRange,
        // businessHours,
        // email,
        // phoneNumber,
        // description,
        coverImageUrl,
        businessImageUrl,
        pickup,
        delivery,
    } = shop

    return (
        <div className='shop-profile-container'>
            <img className="shop-cover-img" src={coverImageUrl} alt={`Cover for ${name}`} />
            <img className="shop-profile-img" src={businessImageUrl} alt={`Profile for ${name}`} />
            <div className='shop-details-profile-info'>
                <h1 className='shop-details-header'>
                    {name}
                    {isOwner && <ShopOwnerButtons shop={shop}/>}
                </h1>
                <p style={{marginBottom: "15px"}}>{address}</p>
                {/* rating here */}
                <div>
                    {/* {delivery && "Delivery"}
                    {delivery && pickup && <span style={{margin:"0 5px"}}>●</span>} */}
                    {/* {pickup && "Pickup"} */}
                    {delivery && pickup ?
                        "Delivery | Pickup"
                        : delivery ? "Delivery Only"
                        : pickup ? "Pickup Only"
                        : "Delivery and Pickup Not Available"
                    }
                </div>
            </div>
        </div>
    )
    }
