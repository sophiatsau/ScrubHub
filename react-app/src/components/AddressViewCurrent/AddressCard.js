import React from 'react'
import { useModal } from '../../context/Modal';
import AddressEditForm from '../AddressEditForm';

export default function AddressCard({address}) {
    const { setModalContent } = useModal();

    const onClick = () => {
        setModalContent(<AddressEditForm address={address}/>);
    };

    return (
        <li onClick={onClick} className='address-card'>
            <span>{address.name}</span>
            <p>{address.fullAddress}</p>
        </li>
    )
}
