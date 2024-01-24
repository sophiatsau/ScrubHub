import React from 'react'
import DeleteConfirmationModal from '../DeleteConfirmationModal'
import OpenModalButton from '../OpenModalButton'

export default function OrderDetailCard({detail}) {
  const deleteOrderDetail = e => {
    e.stopPropagation()
    console.log("DELETE ORDER DETAIL")
  }

  return (
    <>
        {detail.quantity}
        <p className='purple' style={{justifySelf:"start"}}>{detail.critterName}</p>
        <OpenModalButton
          buttonText={<i className="fa-solid fa-trash-can"/>}
          modalComponent={<DeleteConfirmationModal deleteFunction={deleteOrderDetail} itemType="critter" itemName={detail.critterName}/>}
          className="trashcan"
          onButtonClick={deleteOrderDetail}
        />

        <p >{(detail.unitPrice * detail.quantity).toFixed(2)}</p>
    </>
  )
}
