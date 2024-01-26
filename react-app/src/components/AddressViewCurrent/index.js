import React from 'react'
import { useSelector } from 'react-redux'
import OpenModalButton from '../OpenModalButton'
import AddressCard from './AddressCard'
import AddressForm from '../AddressForm'

import './AddressViewCurrent.css'

export default function AddressViewCurrent() {
    const addresses = useSelector(state => state.addresses)

    // on click, open edit address modal
    return (
        <div id="view-current-addresses-container">
        <h1>Your Addresses</h1>
        <div className="current-addresses-container">
            {Object.values(addresses).map(address => (
                <div key={address.id} >
                <AddressCard address={address}/>
                </div>
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
