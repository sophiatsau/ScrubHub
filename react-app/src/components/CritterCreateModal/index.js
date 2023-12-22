import React, {useState} from 'react'
import { useDispatch } from 'react-redux'

import './CritterCreateModal.css'
import { thunkCreateCritter } from '../../store/critters';
import CritterForm from '../CritterForm';
import { useModal } from '../../context/Modal';

export default function CritterCreateModal({shop}) {
  const dispatch = useDispatch();
  const {closeModal} = useModal()
  const [unknownError, setUnknownError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    price: "",
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
          break;
        default:
          newData[name] = value;
          break;
      }
      return newData;
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMITTING!!!", formData)

    const allFormData = new FormData();
    for (let [key, value] of Object.entries(formData)) {
      allFormData.append(key, value)
    }

    const res = await dispatch(thunkCreateCritter(allFormData, shop.id))
    if (res.status===201) {
      closeModal();
    } else if (res.status===400) {
      setFormErrors(res.errors);
    } else {
      setUnknownError(Object.values(res.errors))
    }
    return;
  }

  return (
    <div>
        <h2>Create A New Critter for {shop.name}!</h2>
        <div className='error'>{unknownError}</div>
        <CritterForm {...{formData, onSubmit, handleFormUpdate, formErrors, setFormErrors}}/>
    </div>
  )
}
