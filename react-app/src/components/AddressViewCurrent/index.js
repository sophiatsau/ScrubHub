import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import AddressCreateForm from '../AddressCreateForm'

export default function AddressViewCurrent() {
    const sessionUser = useSelector(state => state.session.user)

    // on click, open edit address modal
    // create address modal

    if (!sessionUser) return <Redirect to="/"/>

    return (
        <div id="view-current-addresses-container">
            <h1>Your Addresses</h1>
            {Object.values(sessionUser.addresses).map(address => (
                <li key={address.id}>
                    {address.fullAddress}
                </li>
            ))}
            <OpenModalButton
                modalComponent={<AddressCreateForm />}
                buttonText={"➕ Add a New Address"}
            />
        </div>
    )
}
