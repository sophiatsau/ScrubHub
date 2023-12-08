import React, { useState } from 'react'

export default function ShopFormImages({previewImages, handleFormUpdate, errors}) {
//   const [previewImages, setPreviewImages] = useState({
//     coverImageUrl: "none",
//     searchImageUrl: "none",
//     businessImageUrl: "none",
//   })

//   const handlePreviewUpdate = (e) => {
//     const { name, files } = e.target;
//     const newPreview = files[0] ? URL.createObjectURL(files[0]) : "none";

//     setPreviewImages(prevImages => {
//         const newData = {...prevImages};
//         newData[name] = newPreview;
//         return newData;

//         // Frees memory when the component unmounts
//         // return () => URL.revokeObjectURL(newPreview)
//     })
//   }

//   const handleFormUpdate = (e) => {
//     handleFormUpdate(e);
//     handlePreviewUpdate(e);
//   }

  return (
    <>
    <h3>1. Choose some images for your shop:</h3>
    {/* <img src={previewImages.coverImageUrl} alt="test"/> */}
    <section className="shop-form-images">
        <label
        className="shop-cover-img"
        style={{backgroundImage: `url(${previewImages.coverImageUrl})`}}
        >
          <span style={{fontSize: "var(--h3Size)"}}>Upload a cover photo for your shop</span>
          <input
            type="file"
            accept="image"
            name="coverImageUrl"
            onChange={handleFormUpdate}
            className='hidden'
            // required
          />
          {errors.coverImageUrl && <div className='error'>{errors.coverImageUrl}</div>}
        </label>
        <label
        className="shop-card-img"
        style={{backgroundImage: `url(${previewImages.searchImageUrl})`}}
        >
          <span>Upload a thumbnail photo</span>
          <input
            type="file"
            accept="image"
            name="searchImageUrl"
            onChange={handleFormUpdate}
            className='hidden'
            // required
          />
          {errors.searchImageUrl && <div className='error'>{errors.searchImageUrl}</div>}
        </label>
        <label htmlFor="profile-img" className="shop-profile-img"
        style={{backgroundImage: `url(${previewImages.businessImageUrl})`}}
        >
            <span>Profile Pic</span>
          <input
            id="profile-img"
            type="file"
            accept="image"
            name="businessImageUrl"
            onChange={handleFormUpdate}
            className='hidden'
            // required
          />
        </label>
        <div className='bold' style={{textAlign:"right", marginRight: "150px"}}>
          Choose a photo for your shop's profile:
          {errors.businessImageUrl && <div className='error'>{errors.businessImageUrl}</div>}
        </div>
    </section>
    </>
  )
}
