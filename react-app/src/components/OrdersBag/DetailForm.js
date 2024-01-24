import React from 'react'
import { useSelector } from 'react-redux'

export default function DetailForm({detail}) {
    const critter = useSelector(state => state.critters[detail.critterId])
    return (
    <form className="bag-detail-form">
        {critter.previewImageUrl && <img src={critter.previewImageUrl} alt={critter.name}/>}
        <h1>Update your Order</h1>
        <label>
            Quantity:
            <input type="number"/>
        </label>
        <button>Update</button>
    </form>
  )
}
