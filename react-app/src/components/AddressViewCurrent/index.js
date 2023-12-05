import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

export default function AddressViewCurrent() {
    const sessionUser = useSelector(state => state.session.user)

    // get all user's addresses
    // each is

    if (!sessionUser) return <Redirect to="/"/>
    return (
        <div>AddressViewCurrent</div>
    )
}
