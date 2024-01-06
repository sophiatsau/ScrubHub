import React from 'react'

export default function OauthButton() {
  const BASE_URL = process.env.NODE_ENV !== "production" ? "http://localhost:5000" : process.env.BASE_URL
  return (
    <a href={`${BASE_URL}/api/auth/oauth_login`}><button type="button">Log In with Google Account</button></a>
  )
}
