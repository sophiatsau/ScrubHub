import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { consumeBag } from '../../store/orders'
import OrderDetailCard from './OrderDetailCard'
import './OrdersBag.css'

export default function Bag({closeMenu}) {
  const bag = useSelector(consumeBag())
  const details = useSelector(state => state.orderDetails)

  return (
    <li className="bag-dropdown">
      {bag ?
      <>
      <div>
        <p style={{marginBottom: "5px"}}>Your order from </p>
        <Link to={`/shops/${bag.shopId}`} onClick={closeMenu}>{bag.shopName}</Link>
      </div>
      <div className='thin-light-border'/>
      <div className="bag-order-type">
        {bag.orderType === "Delivery" ?
        <i className="fa-solid fa-truck" />
        : <i className="fa-solid fa-person-walking"></i>
        }
        {bag.orderType}
        <button className="bag-order-type-button purple-button">Change</button>
      </div>
      <ul>
        {Object.values(details).map(detail => <OrderDetailCard detail={detail} key={detail.id}/>)}
      </ul>
      <div className='thin-light-border'/>
      <div>Items subtotal: {bag.totalPrice}</div>
      <div className='thin-light-border'/>
      <button onClick={console.log} className='purple-button'>Checkout</button>
      </>
      : "Your bag is empty"
      }
    </li>
  )
}
