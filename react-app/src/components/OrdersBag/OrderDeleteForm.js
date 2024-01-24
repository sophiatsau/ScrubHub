import React from 'react'
import { useSelector } from 'react-redux'
import { consumeBag } from '../../store/orders'
import OrderCreateForm from './OrderCreateForm.js'

export default function OrderDeleteForm() {
  const bag = useSelector(consumeBag())

  if (!bag) {
    return <OrderCreateForm />
  }

  return (
    <div>OrderDeleteForm</div>
  )
}
