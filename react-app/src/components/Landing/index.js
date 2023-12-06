import React from 'react'
import { useSelector } from 'react-redux'
import AddressFormModal from '../LocationFormModal'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import OpenModalButton from '../OpenModalButton'

export default function Landing() {
  const address = useSelector(state => state.session.location)

  if (address) {
    return <Redirect to="/shops"/>
  }
  return (
    <div style={{width: "500px", margin: "200px auto 0"}}>
      <OpenModalButton
          buttonText={"📌Enter Your Address"}
          modalComponent={<AddressFormModal type={"temp"}/>}
      />
    </div>
  )
}
