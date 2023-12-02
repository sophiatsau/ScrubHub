import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ShopCard from '../ShopCard'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import { thunkGetAllShops } from '../../store/shops'

export default function ShopsViewCurrent() {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const shops = useSelector(state => state.shops)

  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetAllShops())
    }
  }, [dispatch, sessionUser])

  if (!sessionUser) return <Redirect to="/" />
  if (!Object.values(shops).length) return <div>Loading shops...</div>

  const userShops = sessionUser.shops.map(shopId => shops[shopId])

  return (
    <div>
        <h2>Manage Your Shops</h2>
        {userShops.length ?
        userShops.map(shop => (
          <div key={shop.id}>
            <ShopCard shop={shop}/>
          </div>
        ))
        : <div>You have no shops</div>
        }
        <Link to="shops/new">Create A New Shop</Link>
    </div>
  )
}
