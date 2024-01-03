import React, {useEffect, useState} from 'react'

import { CATEGORIES, ALLOWED_EXTENSIONS } from '../../store/utils';
import './CritterForm.css';

export default function CritterForm({formData, onSubmit, handleFormUpdate, formErrors, setFormErrors}) {
    const [previewImage, setPreviewImage] = useState("none")

    useEffect(() => {
        const previewUrl = formData.previewImageUrl ? URL.createObjectURL(formData.previewImageUrl) : "none";
        setPreviewImage(previewUrl);

        return previewImage === "none" ? "none" : () => URL.revokeObjectURL(previewUrl);
    }, [formData.previewImageUrl, setPreviewImage])

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
                newError = (value < 0.01 || value > 10**16) ? "Please select a price between $0.01 and 10,000,000,000,000,000" : "";
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
                newError = value < 0 ? "Stock must be 0 or greater" : "";
                break;
            }
            default: return
        }

        setFormErrors(prevErrors => {
            if (newError) return {...prevErrors, [name]: newError};
            else {
                let errors = {...prevErrors};
                delete errors[name];
                return errors;
            }
        })
    }

    return (
    <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className='critter-form-container'
    >
        <div className="critter-form-required">
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
                Category:
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
        </div>
        <div className="critter-form-optional">
            <label
            style={{
                backgroundImage: `url(${previewImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="critter-form-img"
            >
                <span>
                    Show us your critter's best angle (Optional):
                    {formErrors.previewImageUrl && <div className='error'>{formErrors.previewImageUrl}</div>}
                </span>
            <input
                type="file"
                name="previewImageUrl"
                onChange={handleFormUpdate}
                onBlur={handleErrorsUpdate}
                className="hidden"
                // style={{padding: "50px 10px"}}
                accept = {ALLOWED_EXTENSIONS.join(", ")}
            />
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
                style={{height: "150px"}}
            />
            <div className='error'>{formErrors.description}</div>
        </label>
        </div>
        <button
            className={`purple-button shop-submit-button critter-submit-button ${Object.values(formErrors).length?"disabled":""}`} type="submit" disabled={Object.values(formErrors).length}
        >Create New Critter!</button>
    </form>
  )
}
