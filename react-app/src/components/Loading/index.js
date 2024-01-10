import React from 'react'
import './Loading.css'

export default function Loading({text}) {
  return (
    <div className='loading-element'>
        <div className='loading-animation'></div>
        <p>{text}</p>
    </div>
  )
}
