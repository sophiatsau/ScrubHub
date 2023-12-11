import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateShop } from '../../store/shops';
import { userAddShop } from '../../store/session';
import { formatBusinessHours } from '../../store/utils';

import "./ShopCreateForm.css"
import ShopFormImages from './ShopFormImages';
import ShopFormBasicInfo from './ShopFormBasicInfo';
import ShopFormHours from './ShopFormHours';
import ShopFormCategories from './ShopFormCategories';

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
    businessHours:"",
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

  const [businessHours, setBusinessHours] = useState({
    Mon: {open:"",close:"",active:false},
    Tue: {open:"",close:"",active:false},
    Wed: {open:"",close:"",active:false},
    Thu: {open:"",close:"",active:false},
    Fri: {open:"",close:"",active:false},
    Sat: {open:"",close:"",active:false},
    Sun: {open:"",close:"",active:false},
  })
  const [previewImages, setPreviewImages] = useState({
    coverImageUrl: "none",
    searchImageUrl: "none",
    businessImageUrl: "none",
  })
  const [categories, setCategories] = useState(new Set())
  const [errors, setErrors] = useState({})
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    window.scroll(0,0)
  }, [])

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
      } else if (type==="button") {
        e.preventDefault();
        newData.priceRange = parseInt(value);
      } else if (type==="checkbox") {
        newData[name] = checked;
      } else {
        newData[name] = value;
      }
      return newData;
    })
  }

  //handle image update
  useEffect(() => {
    const newPreview = formData.businessImageUrl ? URL.createObjectURL(formData.businessImageUrl) : "none";
    setPreviewImages(prevImages => {
      const newData = {...prevImages};
      newData.businessImageUrl = newPreview;
      return newData;
    })
    // Frees memory when the component unmounts
    return newPreview==="none" ? null : () => URL.revokeObjectURL(newPreview)
  },[formData.businessImageUrl])

  useEffect(() => {
    const newPreview = formData.coverImageUrl ? URL.createObjectURL(formData.coverImageUrl) : "none";
    setPreviewImages(prevImages => {
      const newData = {...prevImages};
      newData.coverImageUrl = newPreview;
      return newPreview==="none" ? null : newData;
    })
    // Frees memory when the component unmounts
    return () => URL.revokeObjectURL(newPreview)
  },[formData.coverImageUrl])

  useEffect(() => {
    const newPreview = formData.searchImageUrl ? URL.createObjectURL(formData.searchImageUrl) : "none";
    setPreviewImages(prevImages => {
      const newData = {...prevImages};
      newData.searchImageUrl = newPreview;
      return newData;
    })
    // Frees memory when the component unmounts
    return newPreview==="none" ? null : () => URL.revokeObjectURL(newPreview)
  },[formData.searchImageUrl])

  const handleCategoryUpdate = e => {
    const { name, checked } = e.target;
    const newCats = new Set(categories)
    checked ? newCats.add(name) : newCats.delete(name)
    setCategories(newCats)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};
    setErrors({})

    try {
      formData.businessHours = formatBusinessHours(businessHours)
    } catch (e) {
      errorsObj.businessHours = e.message;
    }

    if (!formData.businessImageUrl) errorsObj.businessImageUrl = "Please select a file."
    if (!formData.coverImageUrl) errorsObj.coverImageUrl = "Please select a file."
    if (!formData.searchImageUrl) errorsObj.searchImageUrl = "Please select a file."

    if (Object.values(errorsObj).length) {
      setErrors(errorsObj);
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

  return (
    <div className='profile-main-container'>
      <h2>Create A New Shop!</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className='shop-form-container'
      >
        <ShopFormImages {...{previewImages, handleFormUpdate, errors}}/>
        <div className='thin-light-border'/>
        <ShopFormBasicInfo {...{formData, handleFormUpdate, errors}}/>
        <div className='thin-light-border'/>
        <ShopFormHours {...{businessHours, handleHoursUpdate, errors}} />
        <div className='thin-light-border'/>
        <ShopFormCategories {...{categories, errors, handleCategoryUpdate}} />

        {errors.UnknownError && <div className='error'>{errors.UnknownError}</div>}
        <button className={`purple-button shop-submit-button ${imageLoading?"disabled":""}`} type="submit" disabled={imageLoading}>Submit</button>
        {(imageLoading) && <p>Loading...</p>}
      </form>
    </div>
  )
}
