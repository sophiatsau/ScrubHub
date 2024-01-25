import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from "../../context/Modal";
import { thunkCheckout } from '../../store/orders';

export default function OrderConfirmation({bag}) {
    const dispatch = useDispatch()
	const {closeModal} = useModal()
    const currentUser = useSelector(state => state.session.user)

    if (!currentUser) return null;

    const checkoutBag = async e => {
        dispatch(thunkCheckout(bag.id))
        closeModal()
    }

    const newBalance = (parseFloat(currentUser.balance) - parseFloat(bag.totalPrice)).toFixed(2)

    return (
        <div className="delete-modal delete-modal-bag order-confirmation-modal">
            <h1>Confirm Your Order</h1>
            <p>Your current balance: ${currentUser.balance}</p>
            <p>Total Price: ${bag.totalPrice}</p>
            <div className='thin-light-border' />
            <p>Your new balance: ${newBalance}</p>
            <div className='error'>{newBalance < 0 && "You do not have enough balance to checkout."}</div>
            <div className="order-confirmation-buttons">
                <button className={newBalance < 0 ? "disabled" : "purple-button"} onClick={checkoutBag}>Checkout</button>
                <button className="light-button" onClick={closeModal}>Keep Browsing</button>
            </div>
		</div>
    )
}
