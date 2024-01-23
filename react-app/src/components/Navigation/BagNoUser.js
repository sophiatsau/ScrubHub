import React from 'react'

import OpenModalButton from '../OpenModalButton'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal'

export default function BagNoUser({closeMenu}) {
  return (
    <li className="bag-when-no-user">
        <OpenModalButton
          buttonText="Log In"
          onButtonClick={closeMenu}
          className="purple link-button"
          modalComponent={<LoginFormModal />}
        />
        <span> or </span>
         <OpenModalButton
          buttonText="Sign Up"
          onButtonClick={closeMenu}
          className="purple link-button"
          modalComponent={<SignupFormModal />}
        />
        <span> to start shopping! </span>
    </li>
  )
}
