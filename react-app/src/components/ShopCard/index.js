import React from 'react';
import { Link } from 'react-router-dom';
import "./ShopCard.css";
import { useSelector } from 'react-redux';

import DisplayPriceRange from './DisplayPriceRange';
import ShopOwnerButtons from './ShopOwnerButtons';

export default function ShopCard({shop}) {
  const sessionUser = useSelector(state => state.session.user)

  return (
    <div className='shop-card-container'>
      <Link to={`/shops/${shop.id}`}>
        <img className="shop-card-img" src={shop.searchImageUrl} alt={shop.name}/>
        <div className='shop-card-info'>
          <span className='bold'>{shop.name}</span>
          <span className='shop-card-price'><DisplayPriceRange priceRange={shop.priceRange}/></span>
          {/* <span>{shop.rating}</span>*/}
        </div>
        <span className='light shop-card-categories'>{shop.categories.join(', ')}</span>
      </Link>
      {sessionUser && sessionUser.id===shop.userId && (
        <ShopOwnerButtons shop={shop}/>
      )}
    </div>
  )
}
