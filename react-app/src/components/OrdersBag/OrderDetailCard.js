import React from 'react'

export default function OrderDetailCard({detail}) {
  const deleteOrderDetail = console.log

  return (
    <>
        {detail.quantity}
        <p className='purple'>{detail.critterName}</p>
        <i className="fa-solid fa-trash-can" onClick={deleteOrderDetail}/>
        <p style={{alignSelf: "end"}}>{(detail.unitPrice * detail.quantity).toFixed(2)}</p>
    </>
  )
}
