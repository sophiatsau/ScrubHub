import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ShopCard from '../ShopCard'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import { thunkGetUserShops } from '../../store/shops'
import "./ShopsViewCurrent.css"
import Loading from '../Loading'

export default function ShopsViewCurrent() {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const shops = useSelector(state => state.shops.allShops)

  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetUserShops())
    }
  }, [dispatch, sessionUser])

  if (!sessionUser) return <Redirect to="/" />

  const userShops = sessionUser.shops.map(shopId => shops[shopId])

  if (userShops.includes(undefined)) return <Loading text="Loading shops..." />

  return (
    <div className='current-shops-container'>
        <h2>Manage Your Shops</h2>
        <div className='shops-list-container'>
        {userShops.length ?
        userShops.map(shop => (
          <div key={shop.id}>
            <ShopCard shop={shop}/>
          </div>
        ))
        : <div>You have no shops</div>
        }
        </div>
        <div className='thin-light-border'/>
        <Link to="/profile/shops/new" className="add-new-button">+ Create A New Shop</Link>
    </div>
  )
}
