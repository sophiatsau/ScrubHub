import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import AddressCreateForm from '../AddressCreateForm'
import OpenModalCard from '../OpenModalCard'
import AddressCard from './AddressCard'

import './AddressViewCurrent.css'

export default function AddressViewCurrent() {
    const sessionUser = useSelector(state => state.session.user)

    // on click, open edit address modal

    if (!sessionUser) return <Redirect to="/"/>

    return (
        <div id="view-current-addresses-container">
            <h1>Your Addresses</h1>
            {Object.values(sessionUser.addresses).map(address => (
                <AddressCard key={address.id} address={address}/>
            ))}
            <OpenModalButton
                modalComponent={<AddressCreateForm />}
                buttonText={"➕ Add a New Address"}
            />
        </div>
    )
}
