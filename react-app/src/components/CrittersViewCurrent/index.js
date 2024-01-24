import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Link } from 'react-router-dom';
import { thunkGetUserCritters } from '../../store/critters';

import "./CrittersViewCurrent.css"
import CritterDisplaySection from '../CritterDisplaySection';
import { thunkGetUserShops } from '../../store/shops';
// import OpenModalButton from '../OpenModalButton';
// import CritterCreateModal from '../CritterCreateModal';
import CritterCreateButton from '../CritterCreateButton';
import Loading from '../Loading';

export default function CrittersViewCurrent() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const critters = useSelector(state => state.critters)
  const shops = useSelector(state => state.shops.allShops)

  useEffect(() => {
    if (sessionUser) {
        dispatch(thunkGetUserShops())
        dispatch(thunkGetUserCritters())
    }
  }, [dispatch, sessionUser])

  if (!sessionUser) return <Redirect to="/" />

  const userCritters = sessionUser.critters.map(critterId => critters[critterId])

  if (!shops || userCritters.includes(undefined)) return <Loading text="Loading critters..." />

  const sortedCritters = {};

  sessionUser.shops.forEach(shopId => sortedCritters[shopId]=[])

  userCritters.forEach(critter => {
    sortedCritters[critter.shopId].push(critter);
  })

  return (
    <div>
        <h2 style={{paddingBottom: "15px"}}>Manage Your Critter Inventory</h2>
        <div className='view-current-critters-container'>
        {
            sessionUser.shops.length ?
            Object.entries(sortedCritters).map(([shopId, critters]) => (
                <div key={shopId}>
                    <Link to={`/shops/${shopId}`}><h3 className='purple'>{shops[shopId].name}</h3></Link>
                    <CritterDisplaySection critters={critters} isOwner={true} />
                    <CritterCreateButton shop={shops[shopId]}/>
                </div>
            ))
            : <p>You are not selling any critters.</p>
        }
        </div>
    </div>
  )
}
