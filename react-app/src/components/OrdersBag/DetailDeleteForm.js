import React from "react";

import { useModal } from "../../context/Modal";

export default function DetailDeleteForm({ deleteFunction, itemName}) {
	const {closeModal} = useModal()

	return (
		<div className="delete-modal delete-modal-bag">
            <p>Remove <span className="bold">{itemName}</span> from your bag?</p>
            <div className="delete-modal-buttons">
                <button className="delete-button purple-button" onClick={deleteFunction}>Yes</button>
                <button className="keep-button light-button" onClick={closeModal}>No</button>
            </div>
		</div>
	);
}
