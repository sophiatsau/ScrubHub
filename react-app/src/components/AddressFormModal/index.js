import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'

import { saveLocation } from '../../store/session'
import "./AddressFormModal.css"
import { useModal } from '../../context/Modal'
import { getFullAddress } from '../../store/utils'

export default function AddressFormModal({type}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user)
  const {closeModal} = useModal()
  //TODO: split this into 2-3 components. Edit should have separate form
  const [formData, setFormData] = useState({
    fullAddress:"",
    address:"",
    city:"",
    state:"",
    zipCode:"",
  })

  const [saveNewLocation, setSaveNewLocation] = useState(false)

  /*TODO: create, edit, temp-storage

  form data object
  error object
  if user, drop down select of saved addresses (name, address)

  temp-storage:
    if logged in, drop down for choosing old location?

    on submit:
      if logged in:
        option to save address
        button: if ssessionUser, then show option
      update store
      redirect to shops

  create:
    on submit:
      add to db
      update store
      close modal, back to addresses/current

  edit:
    on submit:
      update db
      update store
      close modal, back to addresses/current
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    formData.fullAddress = getFullAddress(formData)
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


  return (
    <>
    <h1>Enter Your Location</h1>
    <form onSubmit={handleSubmit} id="address-form">
      <label>
				Address
				<input
					type="text"
          name="address"
					value={formData.address}
					onChange={handleInputChange}
				/>
			</label>
			<label>
				City
				<input
					type="text"
          name="city"
					value={formData.city}
					onChange={handleInputChange}
				/>
			</label>
			<label>
				State
				<input
					type="text"
          name="state"
					value={formData.state}
					onChange={handleInputChange}
				/>
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
			</label>
      <button type="submit">Update Location</button>
      {sessionUser && <Link to="/addresses/new">Save Location</Link>}
    </form>
    </>
  )
}
