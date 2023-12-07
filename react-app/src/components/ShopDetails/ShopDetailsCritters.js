import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CritterDisplaySection from '../CritterDisplaySection'

export default function ShopDetailsCritters({shop}) {
  const dispatch = useDispatch();
  console.log("***CRITTERS*******", shop.critters)
  const allCritters = useSelector(state => state.critters)

  if (!allCritters) return <>Loading Critters...</>

  console.log("🚀 ~ file: ShopDetailsCritters.js:7 ~ ShopDetailsCritters ~ allCritters:", allCritters)
  // if (!allCritters) return

  const shopCritters = shop.critters.map(critterId => allCritters[critterId])
  console.log("🚀 ~ file: ShopDetailsCritters.js:11 ~ ShopDetailsCritters ~ shopCritters:", shopCritters)

  const sortedCritters = shop.critters.reduce((accum, critterId) => {
    const critter = allCritters[critterId]
    accum[critter.category] = accum[critter.category] ? accum[critter.category].concat(critter):[critter]
    return accum;
  },{})
  console.log("🚀 ~ file: ShopDetailsCritters.js:17 ~ sortedCritters ~ sortedCritters:", sortedCritters)

  // get all critters in store
  // for each category, pick
  // split store critters into multiple lists based on category
  // categorized critters + category into critter display section

  return (
    <div>
      <h2>View Our Critters</h2>
      {Object.entries(sortedCritters).map(([cat,list]) => (
        <section key={cat}>
          <CritterDisplaySection critters={list} heading={cat}/>
        </section>
      ))}
    </div>
  )
}
