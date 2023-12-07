import React from 'react'
import "./CritterCard.css"

//usePath for deciding if edit/delete (on /profile/shops/:shopId/edit)
// /profile/critters for stock edit only
// no options if on shop details page

export default function CritterCard({critter, key}) {
    //TODO: popup modal for adding to cart
    const {name, species, price, previewImageUrl, description, stock, category} = critter;

    const classAddOn = stock ? '' : 'sold-out'

    return (
        <div key={key} className={`critter-card-container ${classAddOn}`}>
            <div>
                <h3>{name}</h3>
                {stock ? <span>{stock} left in stock</span> : <span className='error'>Sold Out</span>}
                <p>{species}</p>
                <p>{description}</p>
            </div>
            <div>
                {previewImageUrl ?
                    <img
                    src={previewImageUrl} className="critter-card-img"
                    alt={name}/>
                    : <div/>}
                <span>{price}</span>
                <div className='critter-card-buttons'>
                    {/*  */}
                </div>
            </div>
        </div>
    )
}
