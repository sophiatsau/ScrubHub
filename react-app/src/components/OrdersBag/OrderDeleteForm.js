import React from 'react'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'
import { thunkEmptyBag } from '../../store/orders'
import OrderCreateForm from './OrderCreateForm.js'
import { useModal } from '../../context/Modal.js'

export default function OrderDeleteForm({critter, bag}) {
  const dispatch = useDispatch()
  const {closeModal} = useModal()

  if (!bag) {
    return <OrderCreateForm critter={critter} />
  }

  const deleteFunction = async e => {
    dispatch(thunkEmptyBag(bag.id))
  }

  return (
    <div className="delete-modal delete-modal-bag">
      <h1>Start a new order?</h1>
      <p>Your bag contains items from <Link to={`/shops/${bag.shopId}`} onClick={closeModal}>{bag.shopName}</Link>. Empty your bag to start a new order.</p>
      <div className="delete-modal-buttons">
          <button className="delete-button purple-button" onClick={deleteFunction}>Yes</button>
          <button className="keep-button light-button" onClick={closeModal}>No</button>
      </div>
		</div>
  )
}
