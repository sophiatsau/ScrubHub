import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../context/Modal";
import { thunkEditUserAddress } from "../../store/session";
import { getFullAddress } from '../../store/utils'

import "./AddressEditForm.css";

export default function AddressEditForm({address}) {
	const dispatch = useDispatch();
	const {closeModal} = useModal()

	const [formData, setFormData] = useState(address)

	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		let formErrors = {}
		formData.fullAddress = getFullAddress(formData)

		const data = await dispatch(thunkEditUserAddress(formData));

		if (data.errors) formErrors=data.errors;
		else closeModal();

		setErrors(formErrors)
	};

	const handleInputChange = (e) => {
		const {value, name} = e.target;

		const newData = {...formData};
		newData[name] = value;

		setFormData(newData)
	}

	return (
		<>
		<h1>Update Your Address</h1>
		<form onSubmit={handleSubmit}>
			<ul>
				{errors.status!==400 && Object.values(errors).map((error, idx) => (
					<li key={idx}>{error}</li>
				))}
			</ul>
			<label>
				Give a name to your address:
				<input
					type="text"
          			name="name"
					value={formData.name}
					onChange={handleInputChange}
				/>
				{errors.name && <div className='error'>{errors.name}</div>}
			</label>
			<label>
				Address
				<input
					type="text"
          			name="address"
					value={formData.address}
					onChange={handleInputChange}
				/>
				{errors.address && <div className='error'>{errors.address}</div>}
			</label>
			<label>
				City
				<input
					type="text"
          			name="city"
					value={formData.city}
					onChange={handleInputChange}
				/>
				{errors.city && <div className='error'>{errors.city}</div>}
			</label>
			<label>
				State
				<input
					type="text"
          			name="state"
					value={formData.state}
					onChange={handleInputChange}
				/>
				{errors.state && <div className='error'>{errors.state}</div>}
			</label>
			<label>
				Zip Code
				<input
					type="text"
          			name="zipCode"
					value={formData.zipCode}
					onChange={handleInputChange}
					placeholder="XXXXX or XXXXX-XXXX"
				/>
				{errors.zipCode && <div className='error'>{errors.zipCode}</div>}
			</label>
      		<button type="submit">Update Address</button>
		</form>
		</>
	);
}
