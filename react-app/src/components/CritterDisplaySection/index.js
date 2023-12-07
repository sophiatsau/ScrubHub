import React from 'react'

import CritterCard from '../CritterCard'
import "./CritterDisplaySection.css"

export default function CritterDisplaySection({critters, heading}) {
    // display list of critters. Headers, etc will be from the parent
    // options for what buttons to display based on path
    return (
        <>
        <h3>{heading}</h3>
        <section className='critter-display-card-container'>
            {critters.map(critter => (
                <div key={critter.id}>
                <CritterCard critter={critter}/>
                </div>
            ))}
        </section>
        </>
    )
}
