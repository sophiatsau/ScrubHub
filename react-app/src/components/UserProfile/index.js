import React from 'react'
import SideBar from './SideBar'
import { Route, Switch, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import AddressViewCurrent from '../AddressViewCurrent'
import ShopsViewCurrent from '../ShopsViewCurrent'


//TODO: user profile edit
// user
export default function UserProfile() {
  const {feature} = useParams()
  return (
    <>
    <SideBar/>
    <Switch>
        <Route path="/current/addresses">
            <AddressViewCurrent />
        </Route>
        <Route path="/current/shops">
            <ShopsViewCurrent />
        </Route>
        <Route>
            Future implementation
        </Route>
    </Switch>
    </>
  )
}
