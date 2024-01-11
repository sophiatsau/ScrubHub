import React from 'react'
// import { Link } from 'react-router-dom'
import DisplayPriceRange from '../ShopCard/DisplayPriceRange'

export default function ShopDetailsAbout({shop}) {
  // TODO: add locations
  const {name,
    // address,
    // city,
    // state,
    // zipCode,
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
    formattedAddress,
  } = shop

  return (
    <div className="shop-details-about">
      <h2 className="shop-details-about-header" style={{marginBottom: "0"}}>{name} Info</h2>
      <div className='shop-details-about-basics'>
        <div>
          {categories.map((cat, i) => (
            <span key={cat} className="purple">
              {/* <Link to={`/shops/${cat}`}> */}
                {cat}{i===categories.length-1 ? "":", "}
              {/* </Link> */}
            </span>
          ))}
        </div>
        <DisplayPriceRange priceRange={priceRange}/>
        <div>{description}</div>
      </div>
      <div className="shop-details-about-connect">
        <div className='shop-details-about-address'>
          {/*TODO: google maps*/}
          <p>{formattedAddress}</p>
          {/* TODO: distance from current */}
        </div>
        <h3>Contact Us</h3>
        <span className='purple'>{email}</span> {phoneNumber && <>| <span className='purple'>{phoneNumber}</span></>}
      </div>
      <div className="shop-details-about-hours">
        <table className="shop-details-hours-table">
          <thead>
            <tr>
              <th className="shop-details-hours-header" colSpan="2">Hours</th>
            </tr>
          </thead>
          <tbody>
          {businessHours.split('\n').map((day,i) => (
            <tr key={i} className={parseInt(i)%2===1?"":"disabled"}>
              <td style={{width: "50px"}}>
                {day.split(' ')[0]}
              </td>
              <td>
                {day.split(' ')[1]}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
