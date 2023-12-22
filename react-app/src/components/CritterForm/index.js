import React from 'react'

import { CATEGORIES, ALLOWED_EXTENSIONS } from '../../store/utils';

export default function CritterForm({formData, onSubmit, handleFormUpdate, formErrors, setFormErrors}) {
    const handleErrorsUpdate = (e) => {
        const {name, value, files} = e.target;

        let newError = null;

        switch (name) {
            case "name": {
                newError = (value.length > 255 || value.length < 2) ? "Critter must have a name between 2-255 characters long" : ""
                break
            }
            case "species": {
                newError = (value.length > 255 || value.length < 2) ? "Critter must have a species between 2-255 characters long" : "";
                break;
            }
            case "price": {
                newError = (value < 0.01 || value > 10**16) ? "Please select a price between $0.01 and 10,000,000,000,000,000 for your critter" : "";
                break;
            }
            case "category" : {
                newError = !value ? "Please select a category for your critter" : "";
                break;
            }
            case "previewImageUrl": {
                newError = (!files || !files[0] || ALLOWED_EXTENSIONS.includes(files[0].type)) ? "" : `Allowed file types: ${ALLOWED_EXTENSIONS.join(", ")}`;
                break;
            }
            case "description": {
                newError = value.length > 255 ? "Description must be 255 characters or less" : "";
                break
            }
            case "stock": {
                newError = value <= 0 ? "Stock must be 0 or greater" : "";
                break;
            }
            default: return
        }

        setFormErrors(prevErrors => {
            return {...prevErrors, [name]: newError}
        })
    }

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
                onBlur={handleErrorsUpdate}
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
                onBlur={handleErrorsUpdate}
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
                onBlur={handleErrorsUpdate}
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
                name="category"
                value={formData.category}
                onChange={handleFormUpdate}
                onBlur={handleErrorsUpdate}
                required
            >
                <option value="" disabled>Pick a Category</option>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <div className='error'>{formErrors.category}</div>
        </label>
        <label>
            Show us your critter's best angle (Optional):
            <input
                type="file"
                name="previewImageUrl"
                onChange={handleFormUpdate}
                onBlur={handleErrorsUpdate}
                // accept="image"
                accept = {ALLOWED_EXTENSIONS.join(", ")}
            />
            <div className='error'>{formErrors.previewImageUrl}</div>
        </label>
        <label>
            Tell us about your critter:
            <textarea
                type="text"
                name="description"
                value={formData.description}
                onChange={handleFormUpdate}
                onBlur={handleErrorsUpdate}
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
                onBlur={handleErrorsUpdate}
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
