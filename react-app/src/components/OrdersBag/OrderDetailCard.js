import React from 'react'

export default function OrderDetailCard({detail}) {
  const editOrderDetail = console.log
  const deleteOrderDetail = console.log

  return (
    <div onClick={editOrderDetail} className="order-detail-card">
        {detail.quantity}
        <p className='purple'>{detail.critterName}</p>
        <i className="fa-solid fa-trash-can" onClick={deleteOrderDetail}/>
        <p style={{alignSelf: "end"}}>{detail.unitPrice}</p>
    </div>
  )
}
