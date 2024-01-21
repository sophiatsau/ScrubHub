import React from 'react'

export default function BagButton({user}) {
    // if no user, show login to add to bag
    // if user, show current bag if present
    return (
        <>
        <button className="profile-button purple">
            <i className="fa-solid fa-bag-shopping purple" />
        </button>
        </>
    )
}
