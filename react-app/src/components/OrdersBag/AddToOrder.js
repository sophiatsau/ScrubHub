import React from 'react'
import { useSelector } from 'react-redux'
import { consumeBag } from '../../store/orders'
import DetailEditForm from './DetailEditForm'
import OrderCreateForm from './OrderCreateForm'
import OrderDeleteForm from './OrderDeleteForm'
import DetailCreateForm from './DetailCreateForm'

export default function AddToOrder({critter}) {
  const bag = useSelector(consumeBag())
  const bagDetails = useSelector(state => state.orderDetails)

  if (!bag) return <OrderCreateForm critter={critter}/>

  if (bag.shopId !== critter.shopId) return <OrderDeleteForm bag={bag} critter={critter}/>

  for (let id of bag.orderDetails) {
    if (bagDetails[id]?.critterId === critter.id) {
      return <DetailEditForm detail={bagDetails[id]}/>
    }
  }

  return <DetailCreateForm critter={critter} orderId={bag.id}/>

}
