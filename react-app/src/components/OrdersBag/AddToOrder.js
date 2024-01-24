import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../context/Modal'
import { consumeBag } from '../../store/orders'
import DetailEditForm from './DetailEditForm'
import OrderCreateForm from './OrderCreateForm'
import OrderDeleteForm from './OrderDeleteForm'
import DetailCreateForm from './DetailCreateForm'

export default function AddToOrder({critter}) {
  const bag = useSelector(consumeBag())
  const bagDetails = useSelector(state => state.orderDetails)

  if (!bag) return <OrderCreateForm />

  if (bag.shopId !== critter.shopId) return <OrderDeleteForm orderId={bag.orderId}/>

  for (let id of bag.orderDetails) {
    if (bagDetails[id]?.critterId === critter.id) {
      return <DetailEditForm detail={bagDetails[id]}/>
    }
  }

  return <DetailCreateForm critter={critter} orderId={bag.id}/>

}
