import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { saveLocation } from '../../store/session'
import { useModal } from '../../context/Modal'
import { componentsToAddressLines, fetchData, fullAddressToComponents } from '../../store/utils'
import "./LocationFormModal.css"

export default function LocationFormModal({type}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const {closeModal} = useModal()
  //TODO: option to save address to db
  //TODO: dropdown menu for users with saved addresses
  /*
  Type address
  Click validate
  choose / confirm validate address OR pick a saved address
  Submit button => change location
  */

  const currentLocation = useSelector(state => state.session.location) || {
    fullAddress:"",
    address:"",
    city:"",
    state:"",
    zipCode:"",
  }

  const [formData, setFormData] = useState(currentLocation)
  const [validAddress, setValidAddress] = useState(false)
  const [confirmAddress, setConfirmAddress] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  //{disabled:true} is used to disable button initially, because button disable/enable is based on length of errors. This gets removed when 'handleInputChange' is triggered
  const [errors, setErrors] = useState({disabled: true})
  const [invalidError, setInvalidError] = useState("")
  const [validating, setValidating] = useState(false)

  /*TODO:
  if user, drop down select of saved addresses (name, address)

  temp-storage:
    if logged in, drop down for choosing old location?

    on submit:
      if logged in:
        option to save address
        button: if ssessionUser, then show option
      update store
      redirect to shops
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    // formData.fullAddress = getFullAddress(formData)
    // setFormData(fullAddressToComponents(confirmAddress))
    localStorage.setItem("location", JSON.stringify(formData))
    dispatch(saveLocation(formData))

    closeModal()
    history.push("/shops")
  }

  const handleInputChange = (e) => {
    const {value, name} = e.target;

    const newData = {...formData};
    newData[name] = value;

    setErrors(prev => {
      const newErrors = {...prev};
      switch (name) {
        case "address":
          if (!value && name === "address") newErrors.address = "This field is required."
          else delete newErrors.address
          break
        case "city":
          if (!value) newErrors.city = "This field is required."
          else delete newErrors.city
          break
        case "state":
          if (!value) newErrors.state = "This field is required."
          else delete newErrors.state
          break
        case "zipCode":
          if (value && !value.match(/^\d{5}(-\d{4})?$/)) newErrors.zipCode = "Zip code is in the wrong format (XXXXX or XXXXX-XXXX)"
          else if (!value) newErrors.zipCode = "This field is required."
          else delete newErrors.zipCode
          break
      }
      delete newErrors.disabled
      return newErrors
    })
    setFormData(newData)
    setConfirmed(false)
  }

  // const handleErrors = (e) => {
  //   const newErrors = {...errors}
  //   delete newErrors.disabled
	// 	setErrors(newErrors)
	// }

  useEffect(() => {
    if (validating) {
      setValidating(false)
    }
  }, [validating, setValidating])

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
        // setFormData(fullAddressToComponents(address.formattedAddress))
      }
    } else {
      setInvalidError("Something funny happened. Please refresh the page and try again.")
    }
  }

  const handleConfirmAddress = e => {
    setConfirmed(e.target.checked)
    if (e.target.checked) {
      setFormData(fullAddressToComponents(confirmAddress))
    }
  }

  const validationDiv = invalidError ? <div className='error'>{invalidError}</div> :
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
    <>
    <h1 style={{marginBottom:"8px"}}>Enter Your Location</h1>
    <form onSubmit={handleSubmit} id="location-form">
      <label>
				Address
				<input
					type="text"
          name="address"
					value={formData.address}
					onChange={handleInputChange}
          // onBlur={handleErrors}
          required
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
            onChange={handleInputChange}
            // onBlur={handleErrors}
            required
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
            // onBlur={handleErrors}
            required
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
          // onBlur={handleErrors}
					placeholder="XXXXX or XXXXX-XXXX"
          required
				/>
        <div className='error'>{errors.zipCode}</div>
			</label>
      <button type="submit" onClick={validateAddress} className={`purple-button ${Object.values(errors).length || validating ? "disabled" : ""}`}>Validate Address</button>
      <div style={{minHeight:"40px"}}>{validationDiv}</div>
      <button type="submit" className={`purple-button ${validAddress && confirmed ? "" : "disabled"}`} style={{marginTop:"8px", padding: "8px"}}>Update Location to View Shops!</button>
      {/* {sessionUser && <Link to="/profile/addresses">Save Location</Link>} */}
    </form>
    </>
  )
}
