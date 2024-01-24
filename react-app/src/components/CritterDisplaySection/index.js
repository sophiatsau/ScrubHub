import React from 'react'
// import { useLocation } from 'react-router-dom'

import "./CritterDisplaySection.css"
import CritterCard from '../CritterCard'
import OpenModalCard from '../OpenModalCard'
import AddToOrder from '../OrdersBag/AddToOrder'
// import OpenModalButton from '../OpenModalButton';
// import CritterUpdateModal from '../CritterUpdateModal';
// import CritterCreateModal from '../CritterCreateModal';

export default function CritterDisplaySection({critters, heading, isOwner}) {
    // display list of critters. Headers, etc will be from the parent
    // options for what buttons to display based on path
    // const location = useLocation();

    return (
        <>
        <h3>{heading}</h3>
        <section className='critter-display-card-container'>
            {critters.map(critter => (
                <div key={critter.id}>
                {isOwner ?
                <CritterCard critter={critter} isOwner={isOwner} />
                : <OpenModalCard
                    cardComponent={<CritterCard critter={critter} isOwner={isOwner} />}
                    modalComponent={<AddToOrder />}
                    className={critter.stock ? "critter-modal-card" : "critter-modal-card disabled"}
                />
                }
                </div>
            ))}
            {/* {location.pathname.endsWith("profile/critters") && (
            <OpenModalButton
              modalComponent={<CritterUpdateModal/>}
              buttonText={"+ Add New Critter"}
              className={"critter-open-create-button"}
            />)} */}
        </section>
        </>
    )
}
