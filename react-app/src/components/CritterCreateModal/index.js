import React, {useState} from 'react'
import { useDispatch } from 'react-redux'

import './CritterCreateModal.css'
import { thunkCreateCritter } from '../../store/critters';
import { addUserCritter } from '../../store/session';
import CritterForm from '../CritterForm';
import { useModal } from '../../context/Modal';
import { addShopCritter } from '../../store/shops';

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
    const {name, value, files} = e.target;

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
          newData[name] = value;
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

    const allFormData = new FormData();
    for (let [key, value] of Object.entries(formData)) {
      allFormData.append(key, value);
    }

    const res = await dispatch(thunkCreateCritter(allFormData, shop.id));
    if (res.status===201) {
      dispatch(addUserCritter(res.critter.id));
      dispatch(addShopCritter(shop.id, res.critter.id))
      closeModal();
    } else if (res.status===400) {
      setFormErrors(res.errors);
    } else {
      setUnknownError(Object.values(res.errors));
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
