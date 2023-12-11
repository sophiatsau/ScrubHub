import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import { thunkEditUserAddress, thunkAddUserAddress } from "../../store/session";
import { getFullAddress } from '../../store/utils'

import "./DeleteConfirmationModal.css";

export default function DeleteConfirmationModal({ deleteFunction, itemType, itemName}) {
	// const dispatch = useDispatch();
	const {closeModal} = useModal()

	return (
		<div className="delete-modal">
		<h1>Confirm Deletion</h1>
        <p>Are you sure you want to delete your {itemType.toLowerCase()}, <span className="bold">{itemName}</span>?</p>

        <div className="delete-modal-buttons">
            <button className="delete-button purple-button" onClick={deleteFunction}>Yes, Delete {itemType}</button>
            <button className="keep-button light-button" onClick={closeModal}>No, Keep {itemType}</button>
        </div>
		</div>
	);
}
