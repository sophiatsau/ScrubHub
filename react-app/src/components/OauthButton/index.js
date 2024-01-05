import React from 'react'

export default function OauthButton() {
  return (
    <a href={`${process.env.BASE_URL}/api/auth/oauth_login`}><button>Log In with Google Account</button></a>
  )
}
