import React, { useState } from 'react'

export default function ShopCreateForm() {
  const [formData, setFormData] = useState({
    name:"",
    address:"",
    city:"",
    state:"",
    zipCode:"",
    priceRange:0,
    // businessHours:{
      Mon: "",
      Tue: "",
      Wed: "",
      Thu: "",
      Fri: "",
      Sat: "",
      Sun: "",
    // },
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

  const handleFormUpdate = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData((prevData) => {
      const newData = {...prevData};

      if (type==="file") {
        newData[name] = files[0];
      } else if (type==="checkbox") {
        newData[name] = checked
      } else {
        newData[name] = value;
      }

      return newData;
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
  }

  return (
    <div>
      <h2>Create A New Shop!</h2>
      <form>
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
            type="text"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleFormUpdate}
          />
          {errors.priceRange && <div className='error'>{errors.priceRange}</div>}
        </label>
        <label>
          Business Hours:
          <div className='business-hours-form' />
          <label>
            Mon:
            <input
              type="text"
              name="Mon"
              value={formData.Mon}
              onChange={handleFormUpdate}
            />
          </label>
          <label>
            Tue:
            <input
              type="text"
              name="Tue"
              value={formData.Tue}
              onChange={handleFormUpdate}
            />
          </label>
          <label>
            Wed:
            <input
              type="text"
              name="Wed"
              value={formData.Wed}
              onChange={handleFormUpdate}
            />
          </label>
          <label>
            Thu:
            <input
              type="text"
              name="Thu"
              value={formData.Thu}
              onChange={handleFormUpdate}
            />
          </label>
          <label>
            Fri:
            <input
              type="text"
              name="Fri"
              value={formData.Fri}
              onChange={handleFormUpdate}
            />
          </label>
          <label>
            Sat:
            <input
              type="text"
              name="Sat"
              value={formData.Sat}
              onChange={handleFormUpdate}
            />
          </label>
          <label>
            Sun:
            <input
              type="text"
              name="Sun"
              value={formData.Sun}
              onChange={handleFormUpdate}
            />
          </label>
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
            type="text"
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
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}
