import React from 'react'

export default function OrderDetailCard({detail}) {
  return (
    <li>
      <div className='thin-light-border'/>
      {detail.critterName}
      {detail.quantity}
      {detail.unitPrice}
    </li>
  )
}
