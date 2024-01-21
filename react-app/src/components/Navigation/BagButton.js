import React, { useEffect, useRef, useState } from 'react'

export default function BagButton({user}) {
    // if no user, show login to add to bag
    // if user, show current bag if present
    const ulRef = useRef()
    const [showMenu, setShowMenu] = useState(false)

    const openMenu = () => setShowMenu(!showMenu)
    const closeMenu = () => setShowMenu(false)

    const bagClass = `profile-dropdown ${showMenu ? "":"hidden"}`

    useEffect(() => {
        document.addEventListener("click", closeMenu)
        if (showMenu) {
            //
        }

        return () => document.removeEventListener("click", closeMenu)
    }, [showMenu])

    return (
        <>
        <button className="profile-button purple" onClick={openMenu}>
            <i className="fa-solid fa-bag-shopping purple" />
        </button>
        <ul ref={ulRef} className={bagClass}>
            Bag Contents
        </ul>
        </>
    )
}
