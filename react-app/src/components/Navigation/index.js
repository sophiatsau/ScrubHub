import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import OpenModalButton from '../OpenModalButton';
import AddressFormModal from '../LocationFormModal';
import ProfileButton from './ProfileButton';

import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className='nav-container'>
			<li id="crittr-logo">
				<NavLink exact to="/">
					<i className="fa-solid fa-shop" />
					CRITTR
				</NavLink>
			</li>
			<li>
			<OpenModalButton
				buttonText={<>
				<i className="fa-solid fa-location-dot" style={{marginRight: "10px"}}/>
				Enter Your Address
				</>}
				className={"light-button"}
				modalComponent={<AddressFormModal type={"temp"}/>}
			/>
			</li>
			<li></li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;
