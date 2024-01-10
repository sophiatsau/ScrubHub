import React from 'react'
import { useLocation } from 'react-router-dom';

import "./CritterCard.css"
import OpenModalButton from '../OpenModalButton';
import CritterUpdateModal from '../CritterUpdateModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import { thunkDeleteCritter } from '../../store/critters';
import { deleteUserCritter } from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

//usePath for deciding if edit/delete (on /profile/shops/:shopId/edit)
// /profile/critters for stock edit only
// no options if on shop details page

export default function CritterCard({critter}) {
    //TODO: popup modal for adding to cart
    // in current, is edit / delete. elsewhere, is add to cart
    const location = useLocation();
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const canEdit = location.pathname.endsWith("profile/critters");

    const {name, species, price, previewImageUrl, description, stock} = critter;

    const classAddOn = stock ? '' : canEdit ? 'sold-out' : 'sold-out disabled'

    const deleteCritter = async () => {
        const data = await dispatch(thunkDeleteCritter(critter.id));

        if (data.status === 200) {
            dispatch(deleteUserCritter(critter.id));
        }

        closeModal();
    }

    return (
        <div key={critter.id} className={`critter-card-container ${classAddOn}`}>
            <div className="critter-card-details">
                <p>
                    <span className="bold" style={{marginRight: "5px"}}>{name}</span>
                    <span className="italic light">{species}</span>
                </p>
                {stock ? <span>{stock} left in stock</span> : <span className='error'>Sold Out</span>}
                <p className="light">{description}</p>
            </div>
            <div className="critter-card-right">
                {previewImageUrl ?
                    <img
                    src={previewImageUrl} className="critter-card-img"
                    alt={name}/>
                    : <div/>}
                <span className="critter-price-tag">${price}</span>
                <div className='critter-card-buttons'>
                {canEdit && (
                <>
                    <OpenModalButton
                        modalComponent={<CritterUpdateModal critter={critter}/>}
                        buttonText={"Edit"}
                        className={"purple-button"}
                    />
                    <OpenModalButton
                        modalComponent={<DeleteConfirmationModal itemName={critter.name} itemType={"Critter"} deleteFunction={deleteCritter}/>}
                        buttonText={"Delete"}
                        className={"light-button delete-button"}
                    />
                </>
                )}
                </div>
            </div>
        </div>
    )
}
