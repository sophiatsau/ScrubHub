import React from 'react'
import { useSelector } from 'react-redux'
import AddressFormModal from '../LocationFormModal'
import { Redirect } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'

import "./Landing.css"

export default function Landing() {
  const address = useSelector(state => state.session.location)

  if (address) return <Redirect to="/shops"/>

  return (
    <div className="landing-container">
      <i className="fa-solid fa-shop purple" />
      <h3>See what's around you</h3>
      <p>Share your location to find the critters sold nearby</p>
      <OpenModalButton
          buttonText={<>
          <i className="fa-solid fa-location-dot" style={{marginRight: "10px"}}/>
          Enter Your Address
          </>}
          className={"purple-button landing-button"}
          modalComponent={<AddressFormModal type={"temp"}/>}
      />
    </div>
  )
}
