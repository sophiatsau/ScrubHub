import React from 'react'
import { Link } from 'react-router-dom'
import "./ShopCard.css"

export default function ShopCard({shop}) {
  console.log("🚀 ~ file: index.js:6 ~ ShopCard ~ shop:", shop.categories)
  return (
    <Link to={`/shops/${shop.id}`}>
      <img className="shop-card-img" src={shop.searchImageUrl} alt={shop.name}/>
      <div>
        <span>{shop.name}</span>
        <span>Price: {shop.priceRange}</span>
        {/* <span>{shop.rating}</span>
        <span>{shop.categories}</span> */}
        <span>{shop.categories.map(cat=>(
          <span key={cat}>
            {cat}
          </span>
        ))}</span>
      </div>
    </Link>
  )
}
