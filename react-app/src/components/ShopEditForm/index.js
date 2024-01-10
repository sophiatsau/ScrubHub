import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { thunkEditShop, thunkGetShop } from '../../store/shops';

import { DAYS, CATEGORIES, formatBusinessHours, parseBusinessHours } from '../../store/utils';

import "../ShopCreateForm/ShopCreateForm.css"
import ShopFormImages from '../ShopCreateForm/ShopFormImages';
import ShopFormBasicInfo from '../ShopCreateForm/ShopFormBasicInfo';
import ShopFormHours from '../ShopCreateForm/ShopFormHours';
import ShopFormCategories from '../ShopCreateForm/ShopFormCategories';

export default function ShopEditForm() {
  const dispatch = useDispatch();
  const history = useHistory()
  const {shopId} = useParams()
  // const shop = useSelector(state => state.shops[shopId])
  const sessionUser = useSelector(state => state.session.user)

  const [formData, setFormData] = useState()
  const [previewImages, setPreviewImages] = useState({})
  const [oldPreviews, setOldPreviews] = useState({})
  const [businessHours, setBusinessHours] = useState({})
  const [categories, setCategories] = useState(new Set())
  const [errors, setErrors] = useState({})
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    window.scroll(0,0)
  }, [])

  useEffect(() => {
    dispatch(thunkGetShop(shopId)).then((res)=> {
      setOldPreviews({
        coverImageUrl: res.coverImageUrl,
        searchImageUrl: res.searchImageUrl,
        businessImageUrl: res.businessImageUrl,
      })
      setPreviewImages({
        coverImageUrl: res.coverImageUrl,
        searchImageUrl: res.searchImageUrl,
        businessImageUrl: res.businessImageUrl,
      })
      setBusinessHours(parseBusinessHours(res.businessHours))
      setCategories(new Set(res.categories))
      setFormData({...res});
    })
  }, [dispatch, shopId, setFormData, setBusinessHours, setCategories])

  useEffect(() => {
    if (imageLoading) setImageLoading(false);
  }, [imageLoading, setImageLoading])

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

  //TODO: revoke the url to prevent memory leak
  const handlePreviewUpdate = (data, name) => {
    URL.revokeObjectURL(previewImages[name])
    const newPreview = data[name] ? URL.createObjectURL(data[name]) : oldPreviews[name];
    setPreviewImages(prevImages => {
      const newData = {...prevImages};
      newData[name] = newPreview;
      return newData;
    })
  }

  const handleFormUpdate = (e) => {
    const { name, value, type, files, checked } = e.target;

    setFormData((prevData) => {
      const newData = {...prevData};

      if (type==="file") {
        newData[name] = files[0];
        handlePreviewUpdate(newData, name)
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
    const editedShop = await dispatch(thunkEditShop(shopId,allFormData))

    if (editedShop.errors) {
      setErrors(editedShop.errors)
    } else {
      history.push(`/shops/${editedShop.id}`)
    }
  }

  // console.log("************IMAGE LOADING", imageLoading)

  return (
    <div className='profile-main-container'>
      <h2>Update Your Shop!</h2>
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
        <button type="submit" className={`purple-button shop-submit-button ${imageLoading?"disabled":""}`} disabled={imageLoading}>Submit</button>
        {(imageLoading) && <p>Loading...</p>}
      </form>
    </div>
  )
}
