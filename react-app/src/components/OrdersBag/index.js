import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { consumeBag } from '../../store/orders'
import OrderDetailCard from './OrderDetailCard'
import './OrdersBag.css'
import EmptyBag from './EmptyBag'
import OpenModalCard from '../OpenModalCard'
import DetailEditForm from './DetailEditForm'
// import OrderTypeForm from './OrderTypeForm'
// import OpenModalButton from '../OpenModalButton'

export default function Bag({closeMenu}) {
  const bag = useSelector(consumeBag())
  const details = useSelector(state => state.orderDetails)
  //TODO: functionality for changing order type (delivery vs pickup)

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
        {/* <OpenModalButton
          modalComponent={<OrderTypeForm/>}
          className="bag-order-type-button purple-button"
          onButtonClick={closeMenu}
          buttonText="Change"
        /> */}
      </li>
      <ul>
        {Object.values(details).map(detail => (
          <li key={detail.id}>
            <div className='thin-light-border'/>
            <OpenModalCard
              modalComponent={<DetailEditForm detail={detail}/>}
              cardComponent={<OrderDetailCard detail={detail} closeMenu={closeMenu}/>}
              className="order-detail-card"
              onCardClick={closeMenu}
            />
          </li>
        ))}
      </ul>
      <li className='thin-light-border'/>
      <li className='bag-subtotal'>Items subtotal: <span>{bag.totalPrice}</span></li>
      <li className='thin-light-border'/>
      <button onClick={console.log} className='purple-button'>Checkout</button>
      </>
      : <EmptyBag />
      }
    </>
  )
}
