import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'

export default function SideBar() {
  return (
    <div id="sidebar-container">
        <NavLink to="/current/addresses">
            View Your Addresses
        </NavLink>
        <NavLink to="/current/shops">
            Manage Your Shops
        </NavLink>
        <NavLink to="/current/critters">
            Manage Your Inventory
        </NavLink>
        <NavLink to="/current/orders">
            View Your Orders
        </NavLink>
    </div>
  )
}
