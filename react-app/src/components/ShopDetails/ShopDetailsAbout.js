import React from 'react'
import { Link } from 'react-router-dom'

export default function ShopDetailsAbout({shop}) {
  const {name,
    address,
    city,
    state,
    zipCode,
    priceRange,
    businessHours,
    email,
    phoneNumber,
    description,
    // coverImageUrl,
    // businessImageUrl,
    // pickup,
    // delivery,
    categories,
  } = shop

  return (
    <div>
      <h2>{name} Info</h2>
      {categories.map((cat, i) => (
        <span key={cat}>
          <Link to={`/shops/${cat}`}>
            {cat}{i===categories.length-1 ? "":","}
          </Link>
        </span>
      ))}
      <div>Price Range:{priceRange}</div>
      <div>{description}</div>
      <div>
        {address}
        {city}, {state} {zipCode}
      </div>
      <div>
        <h3>Contact Us</h3>
        {phoneNumber} · {email}
      </div>
      <div>
        <h3>Hours</h3>
        <ul>
          {businessHours.split('\n').map((day,i) => (
            <li key={i}>
              {day}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
