import React from 'react'
import { useSelector } from 'react-redux'
import CritterDisplaySection from '../CritterDisplaySection'
import CritterCreateButton from '../CritterCreateButton'

export default function ShopDetailsCritters({shop, isOwner}) {
  //TODO: sidebar displaying different categories
  const allCritters = useSelector(state => state.critters)
  // console.log("🚀 ~ ShopDetailsCritters ~ allCritters:", allCritters)

  if (!allCritters) return <>Loading Critters...</>

  const sortedCritters = shop.critters.reduce((accum, critterId) => {
    const critter = allCritters[critterId];

    //for case: delete critter from store, yet to delete critter from shop
    if (!critter) return accum;

    accum[critter.category] = accum[critter.category] ? accum[critter.category].concat(critter):[critter]
    return accum;
  },{})
  // console.log("🚀 ~ sortedCritters ~ sortedCritters:", sortedCritters)

  return (
    <div className='shop-critter-display-container'>
      <h2 className='shop-critter-header'>
        View Our Critters
        {isOwner && <CritterCreateButton shop={shop} />}
      </h2>
      <div className='critter-display-sections'>
        {Object.entries(sortedCritters).map(([cat,list]) => (
          <section key={cat}>
            <h3>{cat}</h3>
            <CritterDisplaySection critters={list} isOwner={isOwner}/>
          </section>
        ))}
      </div>
    </div>
  )
}
