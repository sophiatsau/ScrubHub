import React from 'react'
import {Link} from 'react-router-dom'

export default function OrderCard({order}) {
  if (!order) return null

  return (
    <div className='view-current-order-card'>
        <Link to={`/shops/${order.shopId}`}>{order.shopName}</Link>
        <span>${order.totalPrice}</span>
        <span>{order.purchasedAt}</span>
        <span>{order.orderType.toUpperCase()}</span>
    </div>
  )
}
