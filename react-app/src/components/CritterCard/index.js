import React from 'react'
import "./CritterCard.css"

//usePath for deciding if edit/delete (on /profile/shops/:shopId/edit)
// /profile/critters for stock edit only
// no options if on shop details page

export default function CritterCard({critter}) {
    const {name, species, price, previewImageUrl, description, stock, category} = critter;
    return (
        <div>
            <div>
                <h3>{name}</h3>
                <span>{stock} left in stock</span>
                <p>{species}</p>
                <p>{description}</p>
            </div>
            <div>
                <img src={previewImageUrl} alt={name}/>
                <span>{price}</span>
                <div className='critter-card-buttons'>
                    {/*  */}
                </div>
            </div>
        </div>
    )
}
