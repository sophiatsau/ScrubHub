import React from 'react'
import OpenModalButton from '../OpenModalButton';
import CritterCreateModal from '../CritterCreateModal';
import './CritterCreateButton.css'

export default function CritterCreateButton({shop}) {
  return (
    <OpenModalButton
      modalComponent={<CritterCreateModal shop={shop}/>}
      buttonText={`+ Add New Critter to ${shop?.name}`}
      className={"critter-open-create-button"}
    />
  )
}
