import React from 'react'
import { Link } from 'react-router-dom'

export default function ShopByCategoryButton({cat}) {
  return (
    <Link to={`/shops/${cat}`}>{cat}</Link>
  )
}
