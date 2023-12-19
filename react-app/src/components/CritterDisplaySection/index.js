import React from 'react'
// import { useLocation } from 'react-router-dom'

import "./CritterDisplaySection.css"
import CritterCard from '../CritterCard'
// import OpenModalButton from '../OpenModalButton';
// import CritterCreateModal from '../CritterCreateModal';

export default function CritterDisplaySection({critters, heading}) {
    // display list of critters. Headers, etc will be from the parent
    // options for what buttons to display based on path
    // const location = useLocation();

    return (
        <>
        <h3>{heading}</h3>
        <section className='critter-display-card-container'>
            {critters.map(critter => (
                <div key={critter.id}>
                <CritterCard critter={critter}/>
                </div>
            ))}
            {/* {location.pathname.endsWith("profile/critters") && (
            <OpenModalButton
              modalComponent={<CritterCreateModal/>}
              buttonText={"+ Add New Critter"}
              className={"critter-open-create-button"}
            />)} */}
        </section>
        </>
    )
}
