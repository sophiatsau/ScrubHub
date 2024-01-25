import React from 'react'
import {Link} from 'react-router-dom'

export default function OrderCard({order}) {
  if (!order) return null

  return (
    <div className='view-current-order-card'>
        <div className='view-current-order-heading'>
            <Link to={`/shops/${order.shopId}`}>{order.shopName}</Link>
            <span>${order.totalPrice}</span>
        </div>
        <span className='light'>{order.purchasedAt}</span>
        <span className='light'>{order.orderType.toUpperCase()}</span>
    </div>
  )
}
