import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './OrdersViewCurrent.css'
import Loading from '../Loading'
import OrderCard from './OrderCard'

export default function OrdersViewCurrent() {
  const allOrders = useSelector(state => state.orders)
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    const orderList = Object.values(allOrders)
        .sort((a,b) => {
            const dateA = a ? new Date(a.purchasedAt).valueOf() : null
            const dateB = b ? new Date(b.purchasedAt).valueOf() : null

            if (!dateA) return -1
            if (!dateB) return 1

            return dateB - dateA
        })
        .map(order => {
            if (!order || typeof order !== "object") return order

            let newDate = new Date(order.purchasedAt)

            order.purchasedAt = newDate.toLocaleString()
            return order
        })

    const completed = []
    const enRoute = []
    const waitingPickup = []
    let inProgress = false
    let bag = null
    for (let order of orderList) {
        if (!order) continue
        switch (order.orderStatus) {
            case "Completed":
                completed.push(order)
                break
            case "En Route":
                inProgress=true
                enRoute.push(order)
                break
            case "Waiting for Pickup":
                inProgress=true
                waitingPickup.push(order)
                break
            case "Bag":
                bag = order
                break
            default:
                continue
        }
    }

    setOrders({
        completed,
        enRoute,
        waitingPickup,
        bag,
        inProgress,
    })
  }, [allOrders])

  if (!orders) return <Loading text="Loading Orders..."/>

  return (
    <div id="view-orders-container">
        <h1>Your Orders</h1>
        <div className='orders-display-section'>
            <h2>Upcoming Orders</h2>
            {!orders.inProgress && <>You have no upcoming orders.</>}
            {orders.enRoute.length ?
            <>
                <h3>Orders En Route</h3>
                {orders.enRoute.map(order => (
                    <OrderCard key={order.id} order={order}/>
                ))}
            </> : null
            }
            {orders.waitingPickup.length ?
            <>
                <h3>Orders Waiting for Pickup</h3>
                {orders.waitingPickup.map(order => (
                    <OrderCard key={order.id} order={order}/>
                ))}
            </> : null
            }
        </div>
        <div style={{height: "40px"}}/>
        <div className='orders-display-section'>
            <h2>Past Orders</h2>
            {!orders.completed.length && <>You have not made any orders.</>}
            {orders.completed.map(order => (
                <OrderCard key={order.id} order={order}/>
            ))}
        </div>
    </div>
  )
}
