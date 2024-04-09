import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import { thunkEditUserAddress, thunkAddUserAddress } from "../../store/addresses";
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
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		const {address, city, state, zipCode, name,} = formData;
		const newErrors = {};

		if (name.length > 40) newErrors.name = "Field cannot be longer than 40 characters."
		if (!name) newErrors.name = "This field is required."
		if (address.length > 50) newErrors.address = "Field cannot be longer than 50 characters."
		if (!address) newErrors.address = "This field is required."
		if (city.length > 50) newErrors.city = "Field cannot be longer than 50 characters."
		if (!city) newErrors.city = "This field is required."
		if (state.length > 50) newErrors.state = "Field cannot be longer than 50 characters."
		if (!state) newErrors.state = "This field is required."
		if (zipCode && !zipCode.match(/^\d{5}(-\d{4})?$/)) newErrors.zipCode = "Zip code is in the wrong format (use XXXXX or XXXXX-XXXX)"
		if (!zipCode) newErrors.zipCode = "This field is required."

		setErrors(newErrors)
	}, [setErrors, formData, submitted])

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.values(errors).length) return;
		let formErrors = {}
		formData.fullAddress = getFullAddress(formData)

		const data = await dispatch(thunk(formData));

		if (data.errors && data.status===400) formErrors=data.errors;
		else closeModal();

		setErrors(formErrors)
	};

	const handleInputChange = (e) => {
		const {value, name} = e.target;

		const newData = {...formData};
		newData[name] = value;

		setFormData(newData)
	}

	const buttonClass = Object.values(errors).length && submitted ? "disabled purple-button address-form-button":"purple-button address-form-button"

	return (
		<div className="address-form-container">
		<h1>{header}</h1>
		<form onSubmit={(e) => {
			setSubmitted(true)
			handleSubmit(e)}}
			className="address-form"
		>
			<label>
				Give a name to your address:
				<input
					type="text"
          			name="name"
					value={formData.name}
					onChange={handleInputChange}
				/>
				<div className='error'>{submitted && errors.name}</div>
			</label>
			<label>
				Address
				<input
					type="text"
          			name="address"
					value={formData.address}
					onChange={handleInputChange}
				/>
				<div className='error'>{submitted && errors.address}</div>
			</label>
			<div className='city-state'>
				<label>
					City
					<input
						type="text"
						name="city"
						value={formData.city}
						onChange={handleInputChange}
					/>
					<div className='error'>{submitted && errors.city}</div>
				</label>
				<label>
					State
					<input
						type="text"
						name="state"
						value={formData.state}
						onChange={handleInputChange}
					/>
					<div className='error'>{submitted && errors.state}</div>
				</label>
			</div>
			<label>
				Zip Code
				<input
					type="text"
          			name="zipCode"
					value={formData.zipCode}
					onChange={handleInputChange}
					placeholder="XXXXX or XXXXX-XXXX"
				/>
				<div className='error'>{submitted && errors.zipCode}</div>
			</label>
      		<button type="submit"
			className={buttonClass}
			>{buttonText}</button>
		</form>
		</div>
	);
}
