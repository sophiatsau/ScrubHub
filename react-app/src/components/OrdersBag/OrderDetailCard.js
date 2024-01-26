import React from 'react'
import OpenModalButton from '../OpenModalButton'
import DetailDeleteForm from './DetailDeleteForm'
import { useDispatch } from 'react-redux'
import { thunkRemoveFromBag } from '../../store/orderDetails'
import { useModal } from '../../context/Modal'

export default function OrderDetailCard({detail, closeMenu}) {
  const dispatch = useDispatch()
  const {closeModal} = useModal()

  const deleteOrderDetail = async e => {
    await dispatch(thunkRemoveFromBag(detail.id))
    closeModal()
  }

  const onButtonClick = e => {
    e.stopPropagation()
    closeMenu()
  }

  return (
    <>
        {detail.quantity}
        <p className='purple' style={{justifySelf:"start"}}>{detail.critterName}</p>
        <OpenModalButton
          buttonText={<i className="fa-solid fa-trash-can"/>}
          modalComponent={<DetailDeleteForm deleteFunction={deleteOrderDetail} itemType="critter" itemName={detail.critterName}/>}
          className="trashcan"
          onButtonClick={onButtonClick}
        />

        <p >{(detail.unitPrice * detail.quantity).toFixed(2)}</p>
    </>
  )
}
