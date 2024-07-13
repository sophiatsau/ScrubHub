import React from 'react'
import {Link} from 'react-router-dom'

// import { useModal } from '../../context/Modal'
import OpenModalButton from '../OpenModalButton'
import OrderCompleteModal from './OrderCompleteModal'

export default function OrderCard({order}) {
    // let {closeModal} = useModal()

    if (!order) return null

    return (
        <div className='view-current-order-card'>
            <div className='view-current-order-heading'>
                <Link to={`/shops/${order.shopId}`}>{order.shopName}</Link>
                <span>${order.totalPrice}</span>
            </div>
            <div className='view-current-order-body'>
                <div className='view-current-order-body-text'>
                    <span className='light'>{order.purchasedAt}</span> | <span className='light'>{order.orderType.toUpperCase()}</span>
                </div>
                {order.orderStatus !== "Completed" ? <OpenModalButton
                    buttonText="Complete Order"
                    modalComponent={<OrderCompleteModal order={order}/>}
                    className="purple-button"
                /> : <div />}
            </div>
        </div>
    )
}
