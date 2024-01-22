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
    <>
      {bag ?
      <>
      <li className="bag-shop-name">
        <p style={{marginBottom: "5px"}}>Your order from </p>
        <Link to={`/shops/${bag.shopId}`} onClick={closeMenu}>{bag.shopName}</Link>
      </li>
      <li className='thin-light-border'/>
      <li className="bag-order-type">
        {bag.orderType === "Delivery" ?
        <i className="fa-solid fa-truck" />
        : <i className="fa-solid fa-person-walking"></i>
        }
        {bag.orderType}
        <button className="bag-order-type-button purple-button">Change</button>
      </li>
      <ul>
        {Object.values(details).map(detail => (
          <li key={detail.id}>
            <li className='thin-light-border'/>
            <OrderDetailCard detail={detail} />
          </li>
        ))}
      </ul>
      <li className='thin-light-border'/>
      <li className='bag-subtotal'>Items subtotal: <span>{bag.totalPrice}</span></li>
      <li className='thin-light-border'/>
      <button onClick={console.log} className='purple-button'>Checkout</button>
      </>
      : "Your bag is empty"
      }
    </>
  )
}
