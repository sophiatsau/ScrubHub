import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import AddressForm from '../AddressForm';
import OpenModalButton from '../OpenModalButton';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import { thunkDeleteUserAddress } from '../../store/session';
import { useModal } from '../../context/Modal';

export default function AddressCard({address}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    const deleteAddress = async () => {
        const res = await dispatch(thunkDeleteUserAddress(address.id));

        if (res.errors) {
            delete res.errors.status;
            alert(Object.values(res.errors).join(" ")+" "+"Please refresh the page and try again later.")
        } else {
            alert("Address successfully removed!")
        }

        closeModal()
    }

    return (
        <li className='address-card'>
            <span>{address.name}</span>
            <p>{address.fullAddress}</p>
            <div className='address-card-buttons'>
                <OpenModalButton
                    modalComponent={<AddressForm address={address}/>}
                    buttonText={"Edit"}
                />
                <OpenModalButton
                    modalComponent={<DeleteConfirmationModal itemName={"Address"} deleteFunction={deleteAddress}/>}
                    buttonText={"Remove"}
                />
            </div>
        </li>
    )
}
