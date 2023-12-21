import React from 'react'

export default function CritterForm({formData, onSubmit, handleFormUpdate, formErrors}) {
  return (
    <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className='critter-form-container'
    >
        <label>
            Name:
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormUpdate}
                required
            />
            <div className='error'>{formErrors.name}</div>
        </label>
        <label>
            Species:
            <input
                type="text"
                name="species"
                value={formData.species}
                onChange={handleFormUpdate}
                required
            />
            <div className='error'>{formErrors.species}</div>
        </label>
        <label>
            Price:
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormUpdate}
                min={.01}
                max={10**16}
                step={.01}
                required
            />
            <div className='error'>{formErrors.price}</div>
        </label>
        <label>
            Categories:
            <select
                type="text"
                name="categories"
                value={formData.category}
                onChange={handleFormUpdate}
                required
            >
                <option value="" disabled>Pick a Category</option>
            </select>
            <div className='error'>{formErrors.category}</div>
        </label>
        <label>
            Show us your critter's best angle (Optional):
            <input
                type="file"
                name="previewImageUrl"
                value={formData.previewImageUrl}
                onChange={handleFormUpdate}
                accept="image"
            />
            <div className='error'>{formErrors.previewImageUrl}</div>
        </label>
        <label>
            Tell us about your critter:
            <textarea
                type="text"
                name="name"
                value={formData.description}
                onChange={handleFormUpdate}
                placeholder='Describe your critter in 250 words or less'
            />
            <div className='error'>{formErrors.description}</div>
        </label>
        <label>
            Stock:
            <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleFormUpdate}
                min={0}
                step={1}
                required
            />
            <div className='error'>{formErrors.stock}</div>
        </label>
        <button>Create New Critter!</button>
    </form>
  )
}
