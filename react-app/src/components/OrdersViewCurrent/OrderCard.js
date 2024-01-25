import React from 'react'

export default function OrderCard({order}) {
  if (!order) return null

  return (
    <div>
        Status: {order.orderStatus}
        Date: {order.purchasedAt}
    </div>
  )
}
