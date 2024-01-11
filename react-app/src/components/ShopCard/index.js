import React from 'react';
import { Link } from 'react-router-dom';
import "./ShopCard.css";
import { useSelector, useDispatch } from 'react-redux';

import DeleteConfirmationModal from '../DeleteConfirmationModal';
import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import { thunkDeleteShop } from '../../store/shops';
import { deleteUserShop } from '../../store/session';
import DisplayPriceRange from './DisplayPriceRange';
import ShopOwnerButtons from './ShopOwnerButtons';

export default function ShopCard({shop}) {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const {closeModal} = useModal()

  const deleteShop = async () => {
    const res = await dispatch(thunkDeleteShop(shop.id));

    if (res.errors) {
      alert(`${Object.values(res.errors).join(" ")} Please refresh the page and try again later.`)
    } else {
      dispatch(deleteUserShop(shop.id))
    }

    closeModal()
  }


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
      <div className="shop-owner-buttons">
        <Link to={`/profile/shops/${shop.id}/edit`}>
          <button className='purple-button'>Edit Shop</button>
        </Link>
        <OpenModalButton
          modalComponent={<DeleteConfirmationModal itemName={shop.name} itemType={"Shop"} deleteFunction={deleteShop}/>}
          buttonText={"Delete"}
          className="light-button delete-button"
        />
      </div>
      )}
    </div>
  )
}
