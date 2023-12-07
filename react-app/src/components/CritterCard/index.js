import React from 'react'
import "./CritterCard.css"

//usePath for deciding if edit/delete (on /profile/shops/:shopId/edit)
// /profile/critters for stock edit only
// no options if on shop details page

export default function CritterCard({critter}) {
    //TODO: popup modal for adding to cart
    const {name, species, price, previewImageUrl, description, stock, category} = critter;

    const classAddOn = stock ? '' : 'sold-out'

    return (
        <div key={critter.id} className={`critter-card-container ${classAddOn}`}>
            <div className="critter-card-details">
                <p>
                    <span className="bold" style={{marginRight: "5px"}}>{name}</span>
                    <span className="italic light">{species}</span>
                </p>
                {stock ? <span>{stock} left in stock</span> : <span className='error'>Sold Out</span>}
                <p className="light">{description}</p>
            </div>
            <div className="critter-card-right">
                {previewImageUrl ?
                    <img
                    src={previewImageUrl} className="critter-card-img"
                    alt={name}/>
                    : <div/>}
                <span className="critter-price-tag">${price}</span>
                <div className='critter-card-buttons'>
                    {/*  */}
                </div>
            </div>
        </div>
    )
}
