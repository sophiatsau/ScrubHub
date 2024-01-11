import React from 'react'

export default function ShopOwnerButtons({shop}) {
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
