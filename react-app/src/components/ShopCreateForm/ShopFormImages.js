import React from 'react'

export default function ShopFormImages({formData, handleFormUpdate, errors}) {
  return (
    <section className="shop-form-images">
        <h3>1. Choose some images for your shop:</h3>
        <label className="shop-cover-img">
          Upload a cover photo for your store:
          <input
            type="file"
            accept="image"
            name="coverImageUrl"
            onChange={handleFormUpdate}
            required
          />
          {errors.coverImageUrl && <div className='error'>{errors.coverImageUrl}</div>}
        </label>
        <label className="shop-card-img">
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
        <label htmlFor="profile-img" className="shop-profile-img">
          <input
            id="profile-img"
            type="file"
            accept="image"
            name="businessImageUrl"
            onChange={handleFormUpdate}
            required
          />
        </label>
        <div className='bold' style={{textAlign:"right", marginRight: "150px"}}>
          Choose a photo for your shop's profile:
          {errors.businessImageUrl && <div className='error'>{errors.businessImageUrl}</div>}
        </div>
    </section>
  )
}
