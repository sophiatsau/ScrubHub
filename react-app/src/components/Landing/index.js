import React from 'react'
import { useSelector } from 'react-redux'
import AddressCreateButton from '../AddressCreateButton'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'

export default function Landing() {
  const address = useSelector(state => state.location)
  return (
    <div>
      {address ?
        <Redirect to="/shops"/>
        : <AddressCreateButton/>
      }
    </div>
  )
}
