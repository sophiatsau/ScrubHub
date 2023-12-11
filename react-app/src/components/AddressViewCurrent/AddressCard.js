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
            alert(Object.values(res.errors).join(" ")+" "+"Please refresh the page and try again later.")
        }

        closeModal()
    }

    return (
        <li className='address-card'>
            <span className='bold'>{address.name}</span>
            <span style={{lineHeight:"150%"}}>{address.fullAddress}</span>
            <div className='address-card-buttons'>
                <div/>
                <OpenModalButton
                    modalComponent={<AddressForm address={address}/>}
                    buttonText={"Edit"}
                    className={"purple-button"}
                />
                <OpenModalButton
                    modalComponent={<DeleteConfirmationModal itemType={"Address"} deleteFunction={deleteAddress} itemName={address.name}/>}
                    buttonText={"Remove"}
                    className={"light-button"}
                />
            </div>
        </li>
    )
}
