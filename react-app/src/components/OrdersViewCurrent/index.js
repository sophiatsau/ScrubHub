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

    if (orderList.length > 1) {
        // TODO: sort orders by date
        const completed = []
        const enRoute = []
        const waitingPickup = []
        let inProgress = false
        let bag = null

        for (let order of orderList) {
            console.log("🚀 ~ useEffect ~ order:", order)
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
    }
  }, [allOrders])

  if (Object.values(allOrders).length <= 1) return (
    <div>
        You have not made any orders.
    </div>
  )

  if (!orders) return <Loading text="Loading Orders..."/>

  return (
    <div id="view-orders-container">
        <h1>Your Orders</h1>
        {orders.inProgress &&
            <div className='orders-display-section'>
                <h2>Incomplete Orders</h2>
                {orders.enRoute.length &&
                <>
                    <h3>Orders En Route</h3>
                    {orders.enRoute.map(order => (
                        <OrderCard key={order.id} order={order}/>
                    ))}
                </>
                }
                {orders.waitingPickup.length &&
                <>
                    <h3>Orders Waiting for Pickup</h3>
                    {orders.waitingPickup.map(order => (
                        <OrderCard key={order.id} order={order}/>
                    ))}
                </>
                }
            </div>
        }
        <div className='orders-display-section'>
            <h2>Completed Orders</h2>
            {orders.completed.map(order => (
                <OrderCard key={order.id} order={order}/>
            ))}
        </div>
    </div>
  )
}
