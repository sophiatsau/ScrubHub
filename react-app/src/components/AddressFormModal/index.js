import React from 'react'

import { saveLocation } from '../../store/session'
import "./AddressFormModal.css"

export default function AddressFormModal({type}) {
  /*TODO: create, edit, temp-storage

  form data object
  error object

  temp-storage:
    if logged in, drop down for choosing old location?

    on submit:
      if logged in:
        option to save address
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
  }

  const header = type==="temp" ? "Enter Your Location"
    : type==="create" ? "Add An Address"
    : type==="edit" ? "Edit Your Address" : null

  const buttonText = type==="create" ? "Add Address" : "Update Address"

  return (
    <>
    <h1>{header}</h1>
    <form onSubmit={handleSubmit} id="address-form">
      form here!
      <button>{buttonText}</button>
    </form>
    </>
  )
}
