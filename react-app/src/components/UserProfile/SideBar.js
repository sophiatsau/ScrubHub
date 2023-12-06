import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'

export default function SideBar() {
  return (
    <div id="sidebar-container">
        <NavLink to="/profile/addresses">
            View Your Addresses
        </NavLink>
        <NavLink to="/profile/shops">
            Manage Your Shops
        </NavLink>
        <NavLink to="/profile/critters">
            Manage Your Inventory
        </NavLink>
        <NavLink to="/profile/orders">
            View Your Orders
        </NavLink>
    </div>
  )
}
