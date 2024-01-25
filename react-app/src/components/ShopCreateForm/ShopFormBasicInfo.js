import React from 'react'
import DisplayPriceRange from '../ShopCard/DisplayPriceRange'

export default function ShopFormBasicInfo({formData, handleFormUpdate, errors}) {
  return (
    <>
    <h3>2. Tell us about your shop:</h3>
    <section className="shop-basic-info-section">
        <div>
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
            Phone Number (Optional):
            <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormUpdate}
                pattern="\(\d{3}\) \d{3}-\d{4}"
                placeholder='(XXX) XXX-XXXX'
            />
            {errors.phoneNumber && <div className='error'>{errors.phoneNumber}</div>}
            </label>
        </div>
        <div className='bold shop-form-services-container' style={{marginTop:"8px"}}>
          Services Provided:
          <div className='shop-form-services'>
          <input
              type="checkbox"
              name="pickup"
              value={formData.pickup}
              checked={formData.pickup}
              onChange={handleFormUpdate}
          />
          <label>
            Pickup
          </label>
          <input
              type="checkbox"
              name="delivery"
              value={formData.delivery}
              checked={formData.delivery}
              onChange={handleFormUpdate}
            />
          <label>
            Delivery
          </label>
          <div className='error'>{errors.pickup && errors.pickup}</div>
          <div className='error'>{errors.delivery && errors.delivery}</div>
          </div>
        </div>
        <label>
          <span id='price-range-form-display'>
          Price Range:
          <DisplayPriceRange priceRange={formData.priceRange} onClickFunction={handleFormUpdate} />
          </span>
          <span className="light">{"$: < $50\n$$: $50-200\n$$$: $200-800\n$$$$: $800-$2000\n$$$$$: $2000+"}</span>
          {errors.priceRange && <div className='error'>{errors.priceRange}</div>}
        </label>
        <div className='shop-form-address bold'>
          Enter your shop's full address:
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
        <div className='shop-form-city-state'>
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
        </div>
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
        </div>
        <label className='shop-form-description'>
          Description (Optional):
          <textarea
            name="description"
            placeholder='Describe your shop in up to 5000 characters'
            value={formData.description}
            onChange={handleFormUpdate}
          />
          {errors.description && <div className='error'>{errors.description}</div>}
        </label>
    </section>
    </>
  )
}
