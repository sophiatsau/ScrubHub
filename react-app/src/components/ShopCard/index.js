import React from 'react'
import { Link } from 'react-router-dom'
import "./ShopCard.css"

export default function ShopCard({shop}) {
  return (
    <Link to={`/shops/${shop.id}`}>
      <img className="shop-card-img" src={shop.searchImageUrl}/>
      <div>
        <span>{shop.name}</span>
        <span>Price: {shop.priceRange}</span>
        {/* <span>{shop.rating}</span>
        <span>{shop.categories}</span> */}
      </div>
    </Link>
  )
}
