import { fetchData } from "./utils";
import { combineReducers } from "redux";
import addresses from './addresses';
import orders from './orders';

const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const USER_ADD_SHOP = "session/USER_ADD_SHOP"
const DELETE_USER_SHOP = "session/DELETE_USER_SHOP"

const DELETE_USER_CRITTER = "session/DELETE_USER_CRITTER"
const ADD_USER_CRITTER = "session/ADD_USER_CRITTER"


const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

export const userAddShop = (shopId) => ({
	type: USER_ADD_SHOP,
	shopId,
})

export const deleteUserShop = (shopId) => ({
	type: DELETE_USER_SHOP,
	shopId,
})

export const deleteUserCritter = critterId => ({
	type: DELETE_USER_CRITTER,
	critterId
})

export const addUserCritter = critterId => ({
	type: ADD_USER_CRITTER,
	critterId
})


export const authenticate = () => async (dispatch) => {
	const data = await fetchData("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (data.status === 200) {
		// const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const data = await fetchData("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (!data.errors) {
		dispatch(setUser(data)); }
	return data
};

export const logout = () => async (dispatch) => {
	const data = await fetchData("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (data.status===200) {
		dispatch(removeUser());
	}
};

export const signUp = (formData) => async (dispatch) => {
	const data = await fetchData("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

	if (!data.errors) {
		dispatch(setUser(data));
	}
	return data;
};

const initialState = null;

function user(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return action.payload;
		case REMOVE_USER:
			return null;
		case USER_ADD_SHOP:
			return { ...state,
				shops:[...state.shops, parseInt(action.shopId)] }
		case DELETE_USER_SHOP: {
			const newShops =  state.shops.filter(shopId => shopId !== parseInt(action.shopId))
			return {...state, shops: newShops}
		}
		case ADD_USER_CRITTER: {
			return { ...state, critters:[...state.critters, parseInt(action.critterId)] }
		}
		case DELETE_USER_CRITTER: {
			const updatedCritters =  state.critters.filter(critterId => critterId !== parseInt(action.critterId))
			return {...state, critters: updatedCritters}
		}
		default:
			return state;
	}
}


const reducer = combineReducers({
    user,
    addresses,
    orders
})
