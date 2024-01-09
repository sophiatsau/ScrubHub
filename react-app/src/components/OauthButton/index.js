import React from 'react'
import "./OauthButton.css"

export default function OauthButton() {
  const BASE_URL = process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "https://crittr.onrender.com"
  // console.log("🚀 ~ file: index.js:5 ~ OauthButton ~ process.env.BASE_URL:", process.env.BASE_URL)
  // console.log("🚀 ~ file: index.js:5 ~ OauthButton ~ process.env.REACT_APP_BASE_URL:", process.env.REACT_APP_BASE_URL)
  // console.log("🚀 ~ file: index.js:7 ~ OauthButton ~ BASE_URL:", BASE_URL)

  return (
    <a href={`${BASE_URL}/api/auth/oauth_login`} style={{width:"100%"}}><button type="button" className='light-button oauth-button'><img src="https://crittr-images.s3.us-west-1.amazonaws.com/google-logo.png" className='oauth-button-icon'/>Log In with Google Account</button></a>
  )
}
