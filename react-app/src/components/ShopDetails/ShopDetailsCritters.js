import React from 'react'
import { useSelector } from 'react-redux'
import CritterDisplaySection from '../CritterDisplaySection'

export default function ShopDetailsCritters({shop}) {
  //TODO: sidebar displaying different categories
  const allCritters = useSelector(state => state.critters)

  if (!allCritters) return <>Loading Critters...</>

  const shopCritters = shop.critters.map(critterId => allCritters[critterId])

  const sortedCritters = shop.critters.reduce((accum, critterId) => {
    const critter = allCritters[critterId]
    accum[critter.category] = accum[critter.category] ? accum[critter.category].concat(critter):[critter]
    return accum;
  },{})

  // get all critters in store
  // for each category, pick
  // split store critters into multiple lists based on category
  // categorized critters + category into critter display section

  return (
    <div className='shop-critter-display-container'>
      <h2>View Our Critters</h2>
      <div className='critter-display-sections'>
        {Object.entries(sortedCritters).map(([cat,list]) => (
          <section key={cat}>
            <CritterDisplaySection critters={list} heading={cat}/>
          </section>
        ))}
      </div>
    </div>
  )
}
