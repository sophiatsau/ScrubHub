import React from 'react'
import { Link } from 'react-router-dom'
import "./ShopCard.css"
import { useSelector } from 'react-redux'

export default function ShopCard({shop}) {
  const sessionUser = useSelector(state => state.session.user)

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
      {sessionUser && sessionUser.id===shop.userId && (
        <Link to={`/shops/${shop.id}/edit`}>
          <button>Edit Shop</button>
        </Link>
      )}
    </Link>
  )
}
