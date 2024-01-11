import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import DeleteConfirmationModal from '../DeleteConfirmationModal';
import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import { thunkDeleteShop } from '../../store/shops';
import { deleteUserShop } from '../../store/session';

export default function ShopOwnerButtons({shop}) {
    const dispatch = useDispatch()
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
  )
}
