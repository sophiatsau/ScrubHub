import React from 'react'
import { useSelector } from 'react-redux'
import { consumeBag } from '../../store/orders'
import OrderCreateForm from './OrderCreateForm.js'
import { useModal } from '../../context/Modal.js'

export default function OrderDeleteForm({critter, orderId}) {
  const bag = useSelector(consumeBag())
  const {closeModal} = useModal()
  const deleteFunction = console.log

  if (!bag) {
    return <OrderCreateForm critter={critter}/>
  }

  return (
    <div className="delete-modal delete-modal-bag">
      <p>Remove <span className="bold">{critter.name}</span> from your bag?</p>
      <div className="delete-modal-buttons">
          <button className="delete-button purple-button" onClick={deleteFunction}>Yes</button>
          <button className="keep-button light-button" onClick={closeModal}>No</button>
      </div>
		</div>
  )
}
