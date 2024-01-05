import React, {useState} from 'react'
import { useDispatch } from 'react-redux'

import './CritterUpdateModal.css'
import { thunkEditCritter } from '../../store/critters';
import CritterForm from '../CritterForm';
import { useModal } from '../../context/Modal';

export default function CritterUpdateModal({critter}) {
  const dispatch = useDispatch();
  const {closeModal} = useModal()
  const [unknownError, setUnknownError] = useState("")
  const {name, species, price, category, previewImageUrl, description, stock} = critter;
  const [formData, setFormData] = useState({
    name, species, price, category, previewImageUrl:"", description, stock,
    removePreview: false,
  });

  const [formErrors, setFormErrors] = useState({})

  const handleFormUpdate = e => {
    const {name, value, type, files} = e.target;

    setFormData(prevData => {
      const newData = {...prevData}
      switch (name) {
        case "previewImageUrl":
          newData[name] = files[0];
          break;
        case "price":
          if (value > 10**16 || value < 0) {
            return prevData;
          }
        default:
          newData[name] = value;
          break;
      }
      return newData;
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({submitting: true});

    const allFormData = new FormData();
    for (let [key, value] of Object.entries(formData)) {
      allFormData.append(key, value);
    }

    const res = await dispatch(thunkEditCritter(critter.id, allFormData));
    if (res.status===200) {
      closeModal();
    } else if (res.status===400) {
      setFormErrors(res.errors);
    } else {
      setFormErrors({});
      setUnknownError(Object.values(res.errors));
    }
    return;
  }

  return (
    <div>
        <h2>Edit Your Critter!</h2>
        <div className='error'>{unknownError}</div>
        <CritterForm {...{formData, onSubmit, handleFormUpdate, formErrors, setFormErrors, previewUrl: previewImageUrl}}/>
    </div>
  )
}
