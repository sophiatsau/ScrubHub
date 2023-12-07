import React from 'react'

import CritterCard from '../CritterCard'
import "./CritterDisplaySection.css"

export default function CritterDisplaySection({critters, heading}) {
    console.log("🚀 ~ file: index.js:5 ~ CritterDisplay ~ critters:", critters)
    // display list of critters. Headers, etc will be from the outside
    // options for what buttons to display based on path
    return (
        <>
        <h3>{heading}</h3>
        {critters.map(critter => (
            <>
            <CritterCard critter={critter} key={CredentialsContainer.id}/>
            </>
        ))}
        </>
    )
}
