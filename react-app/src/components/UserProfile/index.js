import React from 'react'
import SideBar from './SideBar'
import { Route, Switch } from 'react-router-dom'
import AddressViewCurrent from '../AddressViewCurrent'
import ShopsViewCurrent from '../ShopsViewCurrent'
import ShopCreateForm from '../ShopCreateForm'
import ShopEditForm from '../ShopEditForm'

import "./UserProfile.css";
import CrittersViewCurrent from '../CrittersViewCurrent'

//TODO: user profile edit
// user
export default function UserProfile() {
//   const {feature} = useParams()
  return (
    <div id="user-profile-page-container">
    <SideBar/>
    <div/>
    <Switch>
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
            You have not made any orders.
        </Route>
        <Route>
            Page not found
        </Route>
    </Switch>
    </div>
  )
}
