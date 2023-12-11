import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import OpenModalCard from '../OpenModalCard'
import AddressCard from './AddressCard'
import AddressForm from '../AddressForm'

import './AddressViewCurrent.css'

export default function AddressViewCurrent() {
    const sessionUser = useSelector(state => state.session.user)

    // on click, open edit address modal

    if (!sessionUser) return <Redirect to="/"/>

    return (
        <div id="view-current-addresses-container">
        <h1>Your Addresses</h1>
        <div className="current-addresses-container">
            {Object.values(sessionUser.addresses).map(address => (
                <>
                <AddressCard key={address.id} address={address}/>
                </>
            ))}
        </div>
        <div className='thin-light-border' />
        <OpenModalButton
            modalComponent={<AddressForm />}
            buttonText={"+ Add a New Address"}
            className={'add-new-button'}
            />
        </div>
    )
}
