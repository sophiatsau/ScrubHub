import React from 'react'
import { Link } from 'react-router-dom'
import "./ShopCard.css"
import { useSelector } from 'react-redux'
import ShopDeleteButton from '../ShopDeleteButton'

export default function ShopCard({shop}) {
  const sessionUser = useSelector(state => state.session.user)

  return (
    <div className='shop-card-container'>
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
      {sessionUser && sessionUser.id===shop.userId && (
      <>
        <Link to={`/shops/${shop.id}/edit`}>
          <button>Edit Shop</button>
        </Link>
        <div>
          <ShopDeleteButton shopId={shop.id} />
        </div>
      </>
      )}
    </div>
  )
}
