import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import { thunkEditUserAddress, thunkAddUserAddress } from "../../store/session";
import { getFullAddress } from '../../store/utils'

import "./AddressForm.css";

export default function AddressForm({address}) {
	const dispatch = useDispatch();
	const {closeModal} = useModal()

	const initialData = address || {
		fullAddress:"",
		address:"",
		city:"",
		state:"",
		zipCode:"",
		name:"",
	}
	const header = !address ? "Enter Your Address" : "Update Your Address"
	const buttonText = !address ? "Add Address" : "Update Address"
	const thunk = !address ? thunkAddUserAddress : thunkEditUserAddress

	const [formData, setFormData] = useState(initialData)
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		let formErrors = {}
		formData.fullAddress = getFullAddress(formData)

		const data = await dispatch(thunk(formData));

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
		<h1>{header}</h1>
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
      		<button type="submit">{buttonText}</button>
		</form>
		</>
	);
}
