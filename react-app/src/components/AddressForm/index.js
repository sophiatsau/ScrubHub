import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// import { useAddressValidator } from '../../context/ValidateAddress'
import { useModal } from "../../context/Modal";
import { thunkEditUserAddress, thunkAddUserAddress } from "../../store/addresses";
import { getFullAddress, componentsToAddressLines, fetchData, fullAddressToComponents } from '../../store/utils'
// import ValidateAddressButton from '../ValidateAddressButton'

import "./AddressForm.css";

export default function AddressForm({address}) {
	const dispatch = useDispatch();
	const {closeModal} = useModal()
	// const {
	// 	validAddress,
	// 	confirmed,
	// 	validating, setValidating,
    //     resetValidatorValues,
    // } = useAddressValidator()

	// useEffect(() => resetValidatorValues, [])

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

	//address is validated and is valid / invalid
    const [validAddress, setValidAddress] = useState(false)
    //the validated address
    const [confirmAddress, setConfirmAddress] = useState("")
    //user has confirmed Google API returned address to be desired address
    const [confirmed, setConfirmed] = useState(false)
    //error message returned by validateAddress function if 1) address is invalid or 2) some sort of backend error
    const [invalidError, setInvalidError] = useState("")
    //is server in process of validating address? if true, some buttons should be temporarily disabled
    const [validating, setValidating] = useState(false)

	useEffect(() => {
		if (validating) {
		  setValidating(false)
		}
	  }, [validating, setValidating])

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

		// const newErrors = {...errors};

		// switch (name) {
		// 	case "name":
		// 		if (value.length > 40) newErrors.name = "Field cannot be longer than 40 characters."
		// 		else if (!value) newErrors.name = "This field is required."
		// 		else delete newErrors.name
		// 		break
		// 	case "address":
		// 		if (!value) newErrors.address = "This field is required."
		// 		else if (value.length > 50) newErrors.address = "Field cannot be longer than 50 characters."
		// 		else delete newErrors.address
		// 		break
		// 	case "city":
		// 		if (!value) newErrors.city = "This field is required."
		// 		else if (value.length > 50) newErrors.city = "Field cannot be longer than 50 characters."
		// 		else delete newErrors.city
		// 		break
		// 	case "state":
		// 		if (value.length > 50) newErrors.state = "Field cannot be longer than 50 characters."
		// 		else if (!value) newErrors.state = "This field is required."
		// 		else delete newErrors.state
		// 		break
		// 	case "zipCode":
		// 		if (value && !value.match(/^\d{5}(-\d{4})?$/)) newErrors.zipCode = "Zip code is in the wrong format (XXXXX or XXXXX-XXXX)"
		// 		else if (!value) newErrors.zipCode = "This field is required."
		// 		else delete newErrors.zipCode
		// 		break
		// }

		setFormData(newData)
		setConfirmed(false)
	}

	const handleErrors = (e) => {
		const {value, name} = e.target;

		const newErrors = {...errors};

		switch (name) {
			case "name":
				if (value.length > 40) newErrors.name = "Field cannot be longer than 40 characters."
				else if (!value) newErrors.name = "This field is required."
				else delete newErrors.name
				break
			case "address":
				if (!value) newErrors.address = "This field is required."
				else if (value.length > 50) newErrors.address = "Field cannot be longer than 50 characters."
				else delete newErrors.address
				break
			case "city":
				if (!value) newErrors.city = "This field is required."
				else if (value.length > 50) newErrors.city = "Field cannot be longer than 50 characters."
				else delete newErrors.city
				break
			case "state":
				if (value.length > 50) newErrors.state = "Field cannot be longer than 50 characters."
				else if (!value) newErrors.state = "This field is required."
				else delete newErrors.state
				break
			case "zipCode":
				if (value && !value.match(/^\d{5}(-\d{4})?$/)) newErrors.zipCode = "Zip code is in the wrong format (XXXXX or XXXXX-XXXX)"
				else if (!value) newErrors.zipCode = "This field is required."
				else delete newErrors.zipCode
				break
		}
		setErrors(newErrors)
	}

	const buttonClass = Object.values(errors).length || !validAddress || !confirmed || validating ? "disabled purple-button address-form-button":"purple-button address-form-button"

	const handleConfirmAddress = e => {
        setConfirmed(e.target.checked)
        if (e.target.checked) {
          setFormData({...formData, name: formData.name,
            ...fullAddressToComponents(confirmAddress)})
			setErrors(prev => prev.name ? {name:prev.name} : {})
        }
    }

    const validateAddress = async (e) => {
        e.preventDefault()
        setValidating(true)

        const data = await fetchData(
        `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.REACT_APP_MAPS_KEY}`,
        {
            method:"POST",
            body: JSON.stringify({
            "address": {
                "addressLines": componentsToAddressLines(formData)}
                // "addressLines": ["1 World Way"]}
            })
        })

        if (data.status===200) {
        const {verdict, address} = data.result
        if (verdict.hasUnconfirmedComponents) {
            setInvalidError("No matching address was found. Please check for typos and try again.")
            setValidAddress(false)
        }
        else {
            setInvalidError("")
            setValidAddress(true)
            setConfirmAddress(address.formattedAddress)
        }
        } else {
            setInvalidError("Something funny happened. Please refresh the page and try again.")
        }
    }

	// appears when address validation button clicked
	const validationDiv = invalidError ?
        <div className='error'>{invalidError}</div>
        :
        <div className={validAddress ? 'address-checkbox-container' : 'hidden'}>
            Please confirm your address:
            <label className='address-checkbox' style={{marginTop:"8px"}}>
            <input
                type="checkbox"
                name="fullAddress"
                checked={confirmed}
                value={confirmed}
                onChange={handleConfirmAddress}
                required
            />
            <div>{confirmAddress}</div>
            </label>
        </div>

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
					onBlur={handleErrors}
				/>
				<div className='error'>{errors.name}</div>
			</label>
			<label>
				Address
				<input
					type="text"
          			name="address"
					value={formData.address}
					onChange={handleInputChange}
					onBlur={handleErrors}
				/>
				<div className='error'>{errors.address}</div>
			</label>
			<div className='city-state'>
				<label>
					City
					<input
						type="text"
						name="city"
						value={formData.city}
						onBlur={handleErrors}
						onChange={handleInputChange}
					/>
					<div className='error'>{errors.city}</div>
				</label>
				<label>
					State
					<input
						type="text"
						name="state"
						value={formData.state}
						onChange={handleInputChange}
						onBlur={handleErrors}
					/>
					<div className='error'>{errors.state}</div>
				</label>
			</div>
			<label>
				Zip Code
				<input
					type="text"
          			name="zipCode"
					value={formData.zipCode}
					onChange={handleInputChange}
					onBlur={handleErrors}
					placeholder="XXXXX or XXXXX-XXXX"
				/>
				<div className='error'>{errors.zipCode}</div>
			</label>
			{/* <ValidateAddressButton {...{errors, formData, setFormData}}/> */}
			<button
				type="submit"
				onClick={validateAddress}
				className={`purple-button ${Object.values(errors).length || validating ? "disabled" : ""}`}
			>
				Validate Address
			</button>
			<div style={{minHeight:"40px"}}>
				{validationDiv}
			</div>
      		<button type="submit"
			className={buttonClass}
			>{buttonText}</button>
		</form>
		</div>
	);
}
