import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateShop } from '../../store/shops';
import { userAddShop } from '../../store/session';

import "./ShopCreateForm.css"

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
const CATEGORIES = [
  "Amphibians",
  "Arthropods",
  "Birds",
  "Cats",
  "Dogs",
  "Marines",
  "Other Mammals",
  "Other Critters",
  "Rabbits",
  "Reptiles",
  "Rodents",
]

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
    businessHoursObj:{
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
    categories: [],
  })
  const [categories, setCategories] = useState(new Set())

  const [errors, setErrors] = useState({})
  const [imageLoading, setImageLoading] = useState(false);

  const handleFormUpdate = (e) => {
    const { name, value, type, files, checked } = e.target;

    setFormData((prevData) => {
      const newData = {...prevData};

      if (type==="file") {
        newData[name] = files[0];
      } else if (type==="checkbox") {
        const [day, active] = name.split(" ")
        if (active) {
          newData.businessHoursObj[day].active = checked
        }
        else newData[name] = checked
      } else if (type==="time") {
        const [day, time] = name.split(" ")
        newData.businessHoursObj[day][time] = value
      } else {
        newData[name] = value;
      }

      return newData;
    })
  }

  const handleCategoryUpdate = e => {
    const { name, checked } = e.target;
    const newCats = new Set(categories)
    checked ? newCats.add(name) : newCats.delete(name)
    setCategories(newCats)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})

    try {
      formData.businessHours = formatBusinessHours(formData.businessHoursObj)
    } catch (e) {
      setErrors({businessHours: e.message})
      return;
    }

    formData.categories = [...categories].join(",")

    const allFormData = new FormData();

    for (let [key, value] of Object.entries(formData)) {
      allFormData.append(key, value)
    }

    // Loading message to let user know the data is being processed
    setImageLoading(true);
    const newShop = await dispatch(thunkCreateShop(allFormData))
    setImageLoading(false);

    if (newShop.errors) {
      setErrors(newShop.errors)
    } else {
      await dispatch(userAddShop(newShop.id))
      history.push(`/shops/${newShop.id}`)
    }
  }

  console.log("************IMAGE LOADING", imageLoading)

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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
            placeholder='XXXXX or XXXXX-XXXX'
            pattern="^\d{5}(-\d{4})?$"
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
            required
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
                value={formData.businessHoursObj[day].active}
                onChange={handleFormUpdate}
              />
              {day}:
              <label>
                Open:
                <input
                  type="time"
                  name={`${day} open`}
                  value={formData.businessHoursObj[day].open}
                  onChange={handleFormUpdate}
                  disabled={!formData.businessHoursObj[day].active}
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </label>
              <label>
                Close:
                <input
                  type="time"
                  name={`${day} close`}
                  value={formData.businessHoursObj[day].close}
                  onChange={handleFormUpdate}
                  disabled={!formData.businessHoursObj[day].active}
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
            required
          />
          {errors.email && <div className='error'>{errors.email}</div>}
        </label>
        <label>
          Phone Number (Optional) ((XXX) XXX-XXXX):
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleFormUpdate}
            pattern="\(\d{3}\) \d{3}-\d{4}"
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
        <label className="choose-categories-form">
          Select categories for your shop:
          {CATEGORIES.map(cat => (
            <label key={cat}>
              <input
                type="checkbox"
                name={`${cat}`}
                onChange={handleCategoryUpdate}
                checked={categories.has(cat)}
                />
              {cat}
            </label>
          ))}
          {errors.categories && <div className='error'>{errors.categories}</div>}
        </label>
        <button type="submit" disabled={false}>Submit</button>
        {(imageLoading) && <p>Loading...</p>}
      </form>
    </div>
  )
}
