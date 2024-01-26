import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import SideBar from './SideBar'
import AddressViewCurrent from '../AddressViewCurrent'
import ShopsViewCurrent from '../ShopsViewCurrent'
import ShopCreateForm from '../ShopCreateForm'
import ShopEditForm from '../ShopEditForm'
import CrittersViewCurrent from '../CrittersViewCurrent'
import OrdersViewCurrent from '../OrdersViewCurrent'

import "./UserProfile.css";
import ManageBalancePage from './ManageBalancePage'

//TODO: user profile edit
export default function UserProfile() {
  const sessionUser = useSelector(state => state.session.user)

  if (!sessionUser) return <Redirect to="/"/>

  window.scroll(0,0);
  return (
    <div id="user-profile-page-container">
    <SideBar/>
    <div/>
    <Switch>
        <Route exact path="/profile/balance">
            <ManageBalancePage />
        </Route>
        <Route exact path="/profile/addresses">
            <AddressViewCurrent />
        </Route>
        <Route exact path="/profile/shops">
            <ShopsViewCurrent />
        </Route>
        <Route exact path="/profile/shops/new">
            <ShopCreateForm />
        </Route>
        <Route exact path="/profile/shops/:shopId([0-9]{1,})/edit">
            <ShopEditForm />
        </Route>
        <Route exact path="/profile/critters">
            <CrittersViewCurrent />
        </Route>
        <Route exact path="/profile/orders">
            <OrdersViewCurrent />
        </Route>
        <Route>
            Page not found
        </Route>
    </Switch>
    </div>
  )
}
