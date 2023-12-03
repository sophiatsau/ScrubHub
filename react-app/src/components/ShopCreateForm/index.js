import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateShop } from '../../store/shops';

import "./ShopCreateForm.css"

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

export default function ShopCreateForm() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [formData, setFormData] = useState({
    name:"",
    address:"",
    city:"",
    state:"",
    zipCode:"",
    priceRange:0,
    businessHours:{
      Mon: {open:"",close:"",active:false},
      Tue: {open:"",close:"",active:false},
      Wed: {open:"",close:"",active:false},
      Thu: {open:"",close:"",active:false},
      Fri: {open:"",close:"",active:false},
      Sat: {open:"",close:"",active:false},
      Sun: {open:"",close:"",active:false},
    },
    email: "",
    phoneNumber: "",
    description: "",
    coverImageUrl: null,
    businessImageUrl: null,
    searchImageUrl: null,
    pickup: false,
    delivery: false,
  })

  const [errors, setErrors] = useState({})
  const [imageLoading, setImageLoading] = useState(false);

  const formatPhoneNumber = (num) => {
    return `(${num.slice(0,3)}) ${num.slice(3,6)}-${num.slice(6)}`
  }

  const parseBusinessHours = (obj) => {
    const errors = []
    const businessHours = DAYS.map(day => {
      const {active, open, close} = obj[day]
      const hours = active ? open+"-"+close : "Closed"

      if (active && (!open || !close)) {
        errors.push(`Please set your shop's hours on ${day}.`)
      }

      else if (active && open >= close) {
        errors.push(`Opening hours must be before closing hours on ${day}.`)
      }

      return `${day} ${hours}`
    }).join("\n")

    if (errors.length) throw Error(errors.join("\n"))

    return businessHours
  }

  const handleFormUpdate = (e) => {
    const { name, value, type, files, checked } = e.target;

    setFormData((prevData) => {
      const newData = {...prevData};

      if (type==="file") {
        newData[name] = files[0];
      } else if (type==="checkbox") {
        const [day, active] = name.split(" ")
        if (active) {
          newData.businessHours[day].active = checked
        }
        else newData[name] = checked
      } else if (type==="time") {
        const [day, time] = name.split(" ")
        newData.businessHours[day][time] = value
      } else {
        newData[name] = value;
      }

      return newData;
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})

    let businessHours = ""
    try {
      businessHours = parseBusinessHours(formData.businessHours)
    } catch (e) {
      setErrors({businessHours: e.message})
    }

    const allFormData = new FormData();
    allFormData.append("coverImageUrl",formData.coverImageUrl)
    allFormData.append("businessImageUrl",formData.businessImageUrl)
    allFormData.append("searchImageUrl",formData.searchImageUrl)
    allFormData.append("businessHours", businessHours)
    allFormData.append("phoneNumber", formatPhoneNumber(formData.phoneNumber))

    console.log(formData)
    console.log(businessHours)


    // Loading message to let user know the data is being processed
    setImageLoading(true);
    const newShop = await dispatch(thunkCreateShop(allFormData))
    setImageLoading(false);

    if (newShop.errors) {
      setErrors(newShop.errors)
    } else history.push(`/shops/${newShop.id}`)
  }

  return (
    <div>
      <h2>Create A New Shop!</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label>
          Choose a cover photo:
          <input
            type="file"
            accept="image"
            name="coverImageUrl"
            onChange={handleFormUpdate}
          />
          {errors.coverImageUrl && <div className='error'>{errors.coverImageUrl}</div>}
        </label>
        <label>
          Choose a photo for your shop's profile:
          <input
            type="file"
            accept="image"
            name="businessImageUrl"
            onChange={handleFormUpdate}
          />
          {errors.businessImageUrl && <div className='error'>{errors.businessImageUrl}</div>}
        </label>
        <label>
          Choose a thumbnail photo:
          <input
            type="file"
            accept="image"
            name="searchImageUrl"
            onChange={handleFormUpdate}
          />
          {errors.searchImageUrl && <div className='error'>{errors.searchImageUrl}</div>}
        </label>
        <label>
          Shop Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormUpdate}
          />
          {errors.name && <div className='error'>{errors.name}</div>}
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFormUpdate}
          />
          {errors.address && <div className='error'>{errors.address}</div>}
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleFormUpdate}
          />
          {errors.city && <div className='error'>{errors.city}</div>}
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleFormUpdate}
          />
          {errors.state && <div className='error'>{errors.state}</div>}
        </label>
        <label>
          Zip Code:
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleFormUpdate}
          />
          {errors.zipCode && <div className='error'>{errors.zipCode}</div>}
        </label>
        <label>
          Price Range:
          <input
            type="number"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleFormUpdate}
          />
          {errors.priceRange && <div className='error'>{errors.priceRange}</div>}
        </label>
        <label>
          Business Hours:
          <div className='business-hours-form'>
          {DAYS.map(day => (
            <label key={day} className='daily-business-hours'>
              <input
                type="checkbox"
                name={`${day} active`}
                value={formData.businessHours[day].active}
                onChange={handleFormUpdate}
              />
              {day}:
              <label>
                Open:
                <input
                  type="time"
                  name={`${day} open`}
                  value={formData.businessHours[day].open}
                  onChange={handleFormUpdate}
                  disabled={!formData.businessHours[day].active}
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </label>
              <label>
                Close:
                <input
                  type="time"
                  name={`${day} close`}
                  value={formData.businessHours[day].close}
                  onChange={handleFormUpdate}
                  disabled={!formData.businessHours[day].active}
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </label>
            </label>
          ))}
          </div>
          {errors.businessHours && <div className='error'>{errors.businessHours}</div>}
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleFormUpdate}
          />
          {errors.email && <div className='error'>{errors.email}</div>}
        </label>
        <label>
          Phone Number (Optional):
          <input
            type="number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleFormUpdate}
          />
          {errors.phoneNumber && <div className='error'>{errors.phoneNumber}</div>}
        </label>
        <label>
          Description (Optional):
          <textarea
            name="description"
            placeholder='Describe your shop in up to 5000 characters'
            value={formData.description}
            onChange={handleFormUpdate}
          />
          {errors.description && <div className='error'>{errors.description}</div>}
        </label>
        <label>
          Services Provided:
          <label>
            <input
              type="checkbox"
              name="pickup"
              value={formData.pickup}
              onChange={handleFormUpdate}
            />
            Pickup
            <div className='error'>{errors.pickup && errors.pickup}</div>
          </label>
          <label>
            <input
              type="checkbox"
              name="delivery"
              value={formData.delivery}
              onChange={handleFormUpdate}
            />
            Delivery
            <div className='error'>{errors.delivery && errors.delivery}</div>
          </label>
        </label>
        <button type="submit" disabled={imageLoading}>Submit</button>
        {(imageLoading) && <p>Loading...</p>}
      </form>
    </div>
  )
}
