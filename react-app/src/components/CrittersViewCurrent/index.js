import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { thunkGetUserCritters } from '../../store/critters';

import CritterCard from '../CritterCard';
import "./CrittersViewCurrent.css"

export default function CrittersViewCurrent() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const critters = useSelector(state => state.critters)

  useEffect(() => {
    if (sessionUser) dispatch(thunkGetUserCritters())
  }, [dispatch, sessionUser])

  if (!sessionUser) return <Redirect to="/" />

  const userCritters = sessionUser.critters.map(critterId => critters[critterId])

  if (userCritters.includes(undefined)) return <div>Loading critters...</div>

  return (
    <div>
        <h2>Manage Your Critter Inventory</h2>
        <div>
        {
            userCritters.length ?
            userCritters.map(critter => (
                <div key={critter.id}>
                    <CritterCard critter={critter} />
                </div>
            ))
            : <p>You are not selling any critters.</p>
        }
        </div>
    </div>
  )
}
