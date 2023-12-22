import React, {useState} from 'react'
import { useDispatch } from 'react-redux'

import './CritterCreateModal.css'
import { thunkCreateCritter } from '../../store/critters';
import CritterForm from '../CritterForm';

export default function CritterCreateModal({shop}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    price: null,
    category: "",
    previewImageUrl: "",
    description: "",
    stock: "",
    removePreview: false,
  });

  const [formErrors, setFormErrors] = useState({})

  const handleFormUpdate = e => {
    const {name, value, type, files} = e.target;

    setFormData(prevData => {
      const newData = {...prevData}
      switch (type) {
        case "file":
          newData[name] = files[0];
        default:
          newData[name] = value
      }
      return newData;
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMITTING!!!", formData)
  }

  return (
    <div>
        <h2>Create A New Critter for {shop.name}!</h2>
        <CritterForm {...{formData, onSubmit, handleFormUpdate, formErrors, setFormErrors}}/>
    </div>
  )
}
