import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { thunkDeleteShop } from '../../store/shops'
import { deleteUserShop } from '../../store/session';
import { useDispatch } from 'react-redux';

export default function ShopDeleteButton({shopId}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState([])

    const history = useHistory()
    const dispatch = useDispatch()

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const deleteShop = async (e) => {
      e.preventDefault()

      const res = await dispatch(thunkDeleteShop(shopId))

      if (res.errors) {
        setErrors(Object.values(res.errors))
      } else {
        dispatch(deleteUserShop(shopId))
        alert("Delete successful! Redirecting to your shops...")
        closeModal()
        history.push("/shops/current")
      }

    }

    return (
        <>
        {isModalOpen && (
            <div className="modal">
            <div className="modal-content">
                <h1>Confirm Delete</h1>
                <p>Are you sure you want to delete your shop?</p>
                {
                    errors.length ? errors.forEach(err => (
                        <p className='error'>{err}</p>
                    )) : null
                }
                <div className="modal-buttons">
                    <button className="delete-button" onClick={deleteShop}>
                        Yes (Delete Shop)
                    </button>
                    <button className="keep-button" onClick={closeModal}>
                        No (Keep Shop)
                    </button>
                </div>
            </div>
            </div>
        )}
        <button onClick={openModal}>Delete Shop</button>
        </>

    )
}
