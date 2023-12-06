import React from 'react';
import { Link } from 'react-router-dom';
import "./ShopCard.css";
import { useSelector, useDispatch } from 'react-redux';

// import ShopDeleteButton from '../ShopDeleteButton';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import { thunkDeleteShop } from '../../store/shops';
import { deleteUserShop } from '../../store/session';

export default function ShopCard({shop}) {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const {closeModal} = useModal()

  const deleteShop = async () => {
    const res = await dispatch(thunkDeleteShop(shop.id));

    if (res.errors) {
      delete res.errors.status;
      alert(Object.values(res.errors).join(" ")+" "+"Please refresh the page and try again later.")
    } else {
      dispatch(deleteUserShop(shop.id))
      alert("Shop successfully removed!")
    }

    closeModal()
  }


  return (
    <div className='shop-card-container'>
      <Link to={`/shops/${shop.id}`}>
        <img className="shop-card-img" src={shop.searchImageUrl} alt={shop.name}/>
        <div>
          <span>{shop.name}</span>
          <span>Price: {shop.priceRange}</span>
          {/* <span>{shop.rating}</span>*/}
          <span>{shop.categories.map(cat=>(
            <span key={cat}>
              {cat}
            </span>
          ))}</span>
        </div>
      </Link>
      {sessionUser && sessionUser.id===shop.userId && (
      <div className="shop-owner-buttons">
        <Link to={`/profile/shops/${shop.id}/edit`}>
          <button>Edit Shop</button>
        </Link>
        <OpenModalButton
          modalComponent={<DeleteConfirmationModal itemName={"Shop"} deleteFunction={deleteShop}/>}
          buttonText={"Delete"}
        />
        {/* <div>
          <ShopDeleteButton shopId={shop.id} />
        </div> */}
      </div>
      )}
    </div>
  )
}
