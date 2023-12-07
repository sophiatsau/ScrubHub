import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    closeMenu()
    history.push("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu} className="profile-button purple">
        <i className="fas fa-user-circle purple" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li><h3>Hi, {user.firstName}</h3></li>
            <li onClick={closeMenu} className="dropdown-links">
              <Link to='/profile/addresses'>
                <i className="fa-solid fa-location-dot"/>
                Addresses
              </Link>
              <Link to='/profile/shops'>
                <i className="fa-solid fa-shop" />
                Shops
              </Link>
              <Link to='/profile/critters'>
                <i className="fa-solid fa-paw"/>
                Critters
              </Link>
              <Link to='/profile/orders'>
                <i className="fa-solid fa-receipt"/>
                Orders
              </Link>
              <Link to='/profile/bag'>
                <i className="fa-solid fa-bag-shopping"/>
                Bag
              </Link>
              {/*TODO: split orders into past / upcoming*/}
            </li>
            <li>
              <button className="light-button" onClick={handleLogout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
          <li>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              className="light-button"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              className="light-button"
              modalComponent={<SignupFormModal />}
            />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
