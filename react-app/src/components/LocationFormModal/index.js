import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { saveLocation } from '../../store/session'
import { useModal } from '../../context/Modal'
import { getFullAddress } from '../../store/utils'
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

  // const [saveNewLocation, setSaveNewLocation] = useState(false)

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

    formData.fullAddress = getFullAddress(formData)
    localStorage.setItem("location", JSON.stringify(formData))
    dispatch(saveLocation(formData))

    closeModal()
    history.push("/shops")
  }

  const handleInputChange = (e) => {
    const {value, name} = e.target;

    const newData = {...formData};
    newData[name] = value;

    setFormData(newData)
  }

  const validateAddress = async (e) => {
    const res = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.REACT_APP_MAPS_KEY}`,
      {
        method:"POST",
        body: JSON.stringify({"address": {"addressLines":[formData.fullAddress]}})
      })
    const data = await res.json()
    console.log("GOOGLE SENT BACK THE-", data)
  }


  return (
    <>
    <h1 style={{marginBottom:"8px"}}>Enter Your Location</h1>
    <form onSubmit={handleSubmit} id="location-form">
      <label>
        Address:
        <input
					type="text"
          name="fullAddress"
					value={formData.fullAddress}
					onChange={handleInputChange}
          required
				/>
      </label>
      <button type="button" onClick={validateAddress}>Validate</button>
      <label>
				Address
				<input
					type="text"
          name="address"
					value={formData.address}
					onChange={handleInputChange}
          required
				/>
			</label>
      <div>
        <label>
          City
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
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
          required
				/>
			</label>
      <button type="submit" className='purple-button' style={{marginTop:"8px", padding: "8px"}}>Update Location to View Shops!</button>
      {/* {sessionUser && <Link to="/profile/addresses">Save Location</Link>} */}
    </form>
    </>
  )
}
