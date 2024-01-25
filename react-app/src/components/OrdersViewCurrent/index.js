import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './OrdersViewCurrent.css'
import Loading from '../Loading'

export default function OrdersViewCurrent() {
  const allOrders = useSelector(state => state.orders)
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    const orderList = Object.values(allOrders).filter(order => order)
    if (orderList.length > 1) {
        // TODO: sort orders by date
        const completed = []
        const enRoute = []
        const waitingPickup = []
        let inProgress = false
        let bag = null

        for (let order of orderList) {
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

  if (Object.values(allOrders).length === 1) return (
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
                        <div key={order.id}>
                            Card placeholder:
                            Status: {order.orderStatus}
                            Date: {new Date(order.purchasedAt).toLocaleDateString()}
                        </div>
                    ))}
                </>
                }
                {orders.waitingPickup.length &&
                <>
                    <h3>Orders Waiting for Pickup</h3>
                    {orders.waitingPickup.map(order => (
                        <div key={order.id}>
                            Card placeholder:
                            Status: {order.orderStatus}
                            Date: {order.purchasedAt}
                        </div>
                    ))}
                </>
                }
            </div>
        }
        <div className='orders-display-section'>
            <h2>Completed Orders</h2>
            {orders.completed.map(order => (
                <div key={order.id}>
                    Card placeholder:
                    Status: {order.orderStatus}
                    Date: {order.purchasedAt}
                </div>
            ))}
        </div>
    </div>
  )
}
