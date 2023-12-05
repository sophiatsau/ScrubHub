import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { saveLocation } from '../../store/session'
import "./AddressFormModal.css"
import { useModal } from '../../context/Modal'

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
    console.log("submitting form")

    if (type==="temp") {
      storeLocation(formData)
      closeModal()
      history.push("/shops")
    }

    // type==="temp" ? storeLocation(formData)
    //   : type==="create" ? "Add An Address"
    //   : type==="edit" ? "Edit Your Address" : null
  }

  const storeLocation = (formData) => {
    dispatch(saveLocation(formData))
    if (saveNewLocation) {
      // TODO:
      console.log("option to save address")
    }
  }

  const header = type==="temp" ? "Enter Your Location"
    : type==="create" ? "Add An Address"
    : type==="edit" ? "Edit Your Address" : null

  const buttonText = type==="create" ? "Add Address" : "Update Address"

  return (
    <>
    <h1>{header}</h1>
    <form onSubmit={handleSubmit} id="address-form">
      {/* <label>
					Address
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Optional, required for delivery"
					/>
				</label>
				<label>
					City
					<input
						type="text"
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
				</label>
				<label>
					State
					<input
						type="text"
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
				</label>
				<label>
					Zip Code
					<input
						type="text"
						value={zipCode}
						onChange={(e) => setZipCode(e.target.value)}
						placeholder="XXXXX or XXXXX-XXXX"
					/>
				</label> */}
      <button>{buttonText}</button>
    </form>
    </>
  )
}
