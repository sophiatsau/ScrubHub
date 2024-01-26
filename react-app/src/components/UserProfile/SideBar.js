import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SideBar() {
  return (
    <div id="sidebar-container">
        <h2>Your Account</h2>
        <div className='thin-light-border'/>
        <NavLink to="/profile/balance">
            Manage Your Balance
        </NavLink>
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
