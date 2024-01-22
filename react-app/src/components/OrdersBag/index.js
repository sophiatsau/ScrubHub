import React from 'react'
import { useSelector } from 'react-redux'
import { consumeBag } from '../../store/orders'
import OrderDetailCard from './OrderDetailCard'

export default function Bag() {
  const bag = useSelector(consumeBag())
  const details = useSelector(state => state.orderDetails)

  return (
    <li>
      {bag ?
      <>
      <div>{bag.orderType}</div>
      <div>{bag.shopName}</div>
      <ul>
        {Object.values(details).map(detail => <OrderDetailCard detail={detail} key={detail.id}/>)}
      </ul>
      <div>{bag.totalPrice}</div>
      <button onClick={console.log}>Checkout</button>
      </>
      : "Your bag is empty"
      }
    </li>
  )
}
