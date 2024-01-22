import React from 'react'

export default function OrderDetailCard({detail}) {
  return (
    <li>
      {detail.critterName}
      {detail.quantity}
      {detail.unitPrice}
    </li>
  )
}
