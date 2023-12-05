import React from 'react'
import SideBar from './SideBar'
import { Route, Switch, useParams } from 'react-router-dom'
import AddressViewCurrent from '../AddressViewCurrent'
import ShopsViewCurrent from '../ShopsViewCurrent'
import ShopCreateForm from '../ShopCreateForm'
import ShopEditForm from '../ShopEditForm'

import "./UserProfile.css";

//TODO: user profile edit
// user
export default function UserProfile() {
  const {feature} = useParams()
  return (
    <div id="user-profile-page-container">
    <SideBar/>
    <Switch>
        <Route exact path="/current/addresses">
            <AddressViewCurrent />
        </Route>
        <Route exact path="/current/shops">
            <ShopsViewCurrent />
        </Route>
        <Route exact path="/current/shops/new">
            <ShopCreateForm />
        </Route>
        <Route exact path="/current/shops/:shopId([0-9]{1,})/edit">
            <ShopEditForm />
        </Route>
        <Route>
            Future implementation
        </Route>
    </Switch>
    </div>
  )
}
