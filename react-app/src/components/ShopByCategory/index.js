import React from 'react'
// import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function ShopByCategory() {
  const {category} = useParams();
  // const shops = useSelector(state => state.shops);

  // shops

  /*
  category part of store: cat: {cat: [storeIds]}
  */

  return (
    <div>ShopByCategory {category}</div>
  )
}
