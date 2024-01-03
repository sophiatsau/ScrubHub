import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { thunkGetUserCritters } from '../../store/critters';

import "./CrittersViewCurrent.css"
import CritterDisplaySection from '../CritterDisplaySection';
import { thunkGetUserShops } from '../../store/shops';
import OpenModalButton from '../OpenModalButton';
import CritterCreateModal from '../CritterCreateModal';

export default function CrittersViewCurrent() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const critters = useSelector(state => state.critters)
  const shops = useSelector(state => state.shops)

  useEffect(() => {
    if (sessionUser) {
        dispatch(thunkGetUserShops())
        dispatch(thunkGetUserCritters())
    }
  }, [dispatch, sessionUser])

  if (!sessionUser) return <Redirect to="/" />

  const userCritters = sessionUser.critters.map(critterId => critters[critterId])
  console.log("🚀 ~ file: index.js:28 ~ CrittersViewCurrent ~ sessionUser.critters:", sessionUser.critters)
  console.log("🚀 ~ file: index.js:28 ~ CrittersViewCurrent ~ userCritters:", userCritters)

  if (!shops || userCritters.includes(undefined)) return <div>Loading critters...</div>

  const sortedCritters = {};

  sessionUser.shops.forEach(shopId => sortedCritters[shopId]=[])

  userCritters.forEach(critter => {
    sortedCritters[critter.shopId].push(critter);
  })

  return (
    <div>
        <h2>Manage Your Critter Inventory</h2>
        <div>
        {
            sessionUser.shops.length ?
            Object.entries(sortedCritters).map(([shopId, critters]) => (
                <div key={shopId}>
                    <CritterDisplaySection critters={critters} heading={shops[shopId]?.name} />
                    <OpenModalButton
                      modalComponent={<CritterCreateModal shop={shops[shopId]}/>}
                      buttonText={"+ Add New Critter to Your Shop"}
                      className={"critter-open-create-button"}
                    />
                </div>
            ))
            : <p>You are not selling any critters.</p>
        }
        </div>
    </div>
  )
}
