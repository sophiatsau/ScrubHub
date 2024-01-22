import React, { useEffect, useRef, useState } from 'react'

import Bag from '../OrdersBag'


export default function BagButton({user}) {
    // if no user, show login to add to bag
    // if user, show current bag if present
    const ulRef = useRef()
    const [showMenu, setShowMenu] = useState(false)

    const openMenu = () => {
        if (!showMenu) setShowMenu(true)
    }
    const closeMenu = () => setShowMenu(false)

    const bagClass = `bag-dropdown ${showMenu ? "":"hidden"}`

    useEffect(() => {
        if (!showMenu) return

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        }

        document.addEventListener("click", closeMenu)

        return () => document.removeEventListener("click", closeMenu)
    }, [showMenu])

    return (
        <>
        <button className="profile-button purple" onClick={openMenu}>
            <i className="fa-solid fa-bag-shopping purple" />
        </button>
        <ul ref={ulRef} className={bagClass}>
            {user ?
            <Bag closeMenu/>
            :
            <>Log In or Sign Up to view contents</>}
        </ul>
        </>
    )
}
