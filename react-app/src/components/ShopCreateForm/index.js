import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateShop } from '../../store/shops';
import { userAddShop } from '../../store/session';
import { DAYS, CATEGORIES, formatBusinessHours } from '../../store/utils';

import "./ShopCreateForm.css"
import DisplayPriceRange from '../ShopCard/DisplayPriceRange';
import ShopFormImages from './ShopFormImages';
import ShopFormBasicInfo from './ShopFormBasicInfo';

export default function ShopCreateForm() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [formData, setFormData] = useState({
    name:"",
    address:"",
    city:"",
    state:"",
    zipCode:"",
    priceRange:"",
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
    e.preventDefault();
    const { name, value, type, files, checked } = e.target;

    setFormData((prevData) => {
      const newData = {...prevData};

      if (type==="file") {
        newData[name] = files[0];
      } else if (type==="button") {
        newData.priceRange = parseInt(value);
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
      dispatch(userAddShop(newShop.id))
      history.push(`/shops/${newShop.id}`)
    }
  }

  console.log("************IMAGE LOADING", imageLoading)

  return (
    <div className='profile-main-container'>
      <h2>Create A New Shop!</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className='shop-form-container'
      >
        <ShopFormImages {...{formData, handleFormUpdate, errors}}/>
        <div className='thin-light-border'/>
        <ShopFormBasicInfo {...{formData, handleFormUpdate, errors}}/>
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
        {errors.unknownError && <div className='error'>{errors.unknownError}</div>}
        <button type="submit" disabled={imageLoading}>Submit</button>
        {(imageLoading) && <p>Loading...</p>}
      </form>
    </div>
  )
}
