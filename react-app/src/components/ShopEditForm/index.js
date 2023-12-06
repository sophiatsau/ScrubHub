import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { thunkEditShop, thunkGetShop } from '../../store/shops';
import { userAddShop } from '../../store/session';
import { DAYS, CATEGORIES, formatBusinessHours, parseBusinessHours } from '../../store/utils';

import "./ShopEditForm.css"
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

export default function ShopEditForm() {
  const dispatch = useDispatch();
  const history = useHistory()
  const {shopId} = useParams()
  const shop = useSelector(state => state.shops[shopId])
  const sessionUser = useSelector(state => state.session.user)

  const [formData, setFormData] = useState()
  const [businessHours, setBusinessHours] = useState()
  const [categories, setCategories] = useState(new Set())
  const [errors, setErrors] = useState({})
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    dispatch(thunkGetShop(shopId)).then((res)=> {
      setBusinessHours(parseBusinessHours(res.businessHours))
      setCategories(new Set(res.categories))
      setFormData({...res});
    })
  }, [dispatch, shopId, setFormData, setBusinessHours, setCategories])

  if (!formData) return <div>Loading Form...</div>

  if (!sessionUser || (formData && formData.userId !== sessionUser.id)){
    return <Redirect to="/"/>
  }

  const handleHoursUpdate = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type==="checkbox" ? checked : value;

    setBusinessHours((prevData) => {
      const [day, time] = name.split(" ");
      const newHours = {...prevData};
      newHours[day][time] = newValue;

      return newHours;
    })
  }

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
      formData.businessHours = formatBusinessHours(businessHours)
    } catch (e) {
      setErrors({businessHours: e.message})
      return;
    }

    formData.categories = [...categories].join(",")

    const imageTypes = ["searchImageUrl","coverImageUrl","businessImageUrl"]

    imageTypes.forEach(field => {
      console.log(field, typeof formData[field] === "string")
      if (typeof formData[field] === "string") {
        delete formData[field];
      }
    })

    console.log(formData)

    const allFormData = new FormData();

    for (let [key, value] of Object.entries(formData)) {
      allFormData.append(key, value)
    }

    // Loading message to let user know the data is being processed
    setImageLoading(true);
    const editedShop = await dispatch(thunkEditShop(shopId,allFormData))
    setImageLoading(false);

    if (editedShop.errors) {
      setErrors(editedShop.errors)
    } else {
      history.push(`/shops/${editedShop.id}`)
    }
  }

  console.log("************IMAGE LOADING", imageLoading)

  return (
    <div>
      <h2>Update Your Shop!</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label>
          Choose a cover photo:
          <img src={shop.coverImageUrl} alt="Current Cover" />
          <input
            type="file"
            accept="image"
            name="coverImageUrl"
            onChange={handleFormUpdate}
            // required
          />
          {errors.coverImageUrl && <div className='error'>{errors.coverImageUrl}</div>}
        </label>
        <label>
          Choose a photo for your shop's profile:
          <img src={shop.businessImageUrl} alt="Current Profile" />
          <input
            type="file"
            accept="image"
            name="businessImageUrl"
            onChange={handleFormUpdate}
            // required
          />
          {errors.businessImageUrl && <div className='error'>{errors.businessImageUrl}</div>}
        </label>
        <label>
          Choose a thumbnail photo:
          <img src={shop.searchImageUrl} alt="Current Search" />
          <input
            type="file"
            accept="image"
            name="searchImageUrl"
            onChange={handleFormUpdate}
            // required
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
          Price Range (1-5):
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
                value={businessHours[day].active}
                checked={businessHours[day].active}
                onChange={handleHoursUpdate}
              />
              {day}:
              <label>
                Open:
                <input
                  type="time"
                  name={`${day} open`}
                  value={businessHours[day].open}
                  onChange={handleHoursUpdate}
                  disabled={!businessHours[day].active}
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </label>
              <label>
                Close:
                <input
                  type="time"
                  name={`${day} close`}
                  value={businessHours[day].close}
                  onChange={handleHoursUpdate}
                  disabled={!businessHours[day].active}
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
              checked={formData.pickup}
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
              checked={formData.delivery}
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
                value={categories.has(cat)}
                />
              {cat}
            </label>
          ))}
          {errors.categories && <div className='error'>{errors.categories}</div>}
        </label>
        {errors.unknownError && <div className='error'>{errors.unknownError}</div>}
        <button type="submit" disabled={false}>Submit</button>
        {(imageLoading) && <p>Loading...</p>}
      </form>
    </div>
  )
}
