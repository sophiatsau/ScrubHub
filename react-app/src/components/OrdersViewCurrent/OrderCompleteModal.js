import React from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal.js'
import { thunkCompleteOrder } from '../../store/orders.js'

export default function OrderCompleteModal({order}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    const completeOrder = async e => {
        await dispatch(thunkCompleteOrder(order.id))
        closeModal()
    }

    return (
        <div className="delete-modal">
        <h1>Complete Order</h1>
        <p>Complete your order from {order.shopName} for ${order.totalPrice}.</p>
        <div className="delete-modal-buttons">
            <button className="delete-button purple-button" onClick={completeOrder}>Yes</button>
            <button className="keep-button light-button" onClick={closeModal}>No</button>
        </div>
          </div>
    )
}
