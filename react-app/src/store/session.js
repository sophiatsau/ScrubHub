import { fetchData } from "./utils";

// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const USER_ADD_SHOP = "session/USER_ADD_SHOP"
const DELETE_USER_SHOP = "session/DELETE_USER_SHOP"

const SAVE_LOCATION = "session/SAVE_LOCATION"
// const GET_USER_ADDRESSES = "session/GET_USER_ADDRESSES"
const ADD_USER_ADDRESS = "session/ADD_USER_ADDRESS"
const EDIT_USER_ADDRESS = "session/EDIT_USER_ADDRESS"
const DELETE_USER_ADDRESS = "session/DELETE_USER_ADDRESS"

const DELETE_USER_CRITTER = "session/DELETE_USER_CRITTER"
const ADD_USER_CRITTER = "session/ADD_USER_CRITTER"

const START_ORDER = "session/START_ORDER"
const ADD_TO_BAG = "session/ADD_TO_BAG"
const UPDATE_BAG = "session/UPDATE_BAG"
const EMPTY_BAG = "session/EMPTY_BAG"
const REMOVE_FROM_BAG = "session/REMOVE_FROM_BAG"
const CHECKOUT = "session/CHECKOUT"
const COMPLETE_ORDER = "session/COMPLETE_ORDER"

/************* ACTIONS **************** */
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

export const saveLocation = location => ({
	type: SAVE_LOCATION,
	location,
})

const addUserAddress = address => ({
	type: ADD_USER_ADDRESS,
	address,
})

const editUserAddress = address => ({
	type: EDIT_USER_ADDRESS,
	address,
})

const deleteUserAddress = addressId => ({
	type: DELETE_USER_ADDRESS,
	addressId,
})

export const deleteUserCritter = critterId => ({
	type: DELETE_USER_CRITTER,
	critterId
})

export const addUserCritter = critterId => ({
	type: ADD_USER_CRITTER,
	critterId
})

export const startOrder = (order) => ({
	type: START_ORDER,
	order
})

export const addToBag = (detail) => ({
	type: ADD_TO_BAG,
	detail
})

export const updateBag = (detail) => ({
	type: UPDATE_BAG,
	detail
})

export const emptyBag = () => ({
	type: EMPTY_BAG,
})

export const removeFromBag = (detailId) => ({
	type: REMOVE_FROM_BAG,
	detailId
})

export const checkout = () => ({
	type: CHECKOUT,
})

export const completeOrder = (order) => ({
	type: COMPLETE_ORDER,
	order
})

/********************** THUNKS ************** */
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

export const thunkAddUserAddress = address => async dispatch => {
	const res = await fetch(`/api/addresses/new`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(address),
	})

	const data = await res.json()

	if (res.ok) {
		dispatch(addUserAddress(data))
	}
	else data.status = res.status

	return data
}

export const thunkEditUserAddress = address => async dispatch => {
	const res = await fetch(`/api/addresses/${address.id}/edit`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(address),
	})

	const data = await res.json()

	if (res.ok) dispatch(editUserAddress(data))
	else data.status = res.status

	return data
}

export const thunkDeleteUserAddress = addressId => async dispatch => {
	const res = await fetch(`/api/addresses/${addressId}/delete`, {
		method: "DELETE",
	})

	const data = await res.json()

	if (res.ok) dispatch(deleteUserAddress(parseInt(addressId)))
	else data.status = res.status

	return data
}

/***************** ORDERS ****************** */


const initLocation = JSON.parse(localStorage.getItem("location"))
const initialState = { user: null, location: initLocation };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		// set, remove user will keep the location which isn't saved in database.
		case SET_USER:
			return { user: action.payload, location: state.location };
		case REMOVE_USER:
			return { user: null, location: state.location };
		case USER_ADD_SHOP:
			return { ...state, user: {...state.user,
				shops:[...state.user.shops, parseInt(action.shopId)]} }
		case DELETE_USER_SHOP: {
			const newShops =  state.user.shops.filter(shopId => shopId !== parseInt(action.shopId))
			return {...state, user: {...state.user, shops: newShops}}
		}
		case SAVE_LOCATION: {
			return {...state, location: action.location}
		}
		case ADD_USER_ADDRESS: {
			const newAddresses = {
				...state.user.addresses,
				[action.address.id]: action.address,
			};
			return {
				...state,
				user: {
					...state.user,
					addresses: newAddresses,
				},
			}
		}
		case EDIT_USER_ADDRESS: {
			const updatedAddresses = {
				...state.user.addresses,
				[action.address.id]: action.address,
			};
			return {
				...state,
				user: {
					...state.user,
					addresses: updatedAddresses,
				},
			}
		}
		case DELETE_USER_ADDRESS: {
			const updatedAddresses = {...state.user.addresses};
			delete updatedAddresses[action.addressId];
			return {
				...state,
				user: {
					...state.user,
					addresses: updatedAddresses,
				}
			}
		}
		case ADD_USER_CRITTER: {
			return { ...state, user: {...state.user, critters:[...state.user.critters, parseInt(action.critterId)]} }
		}
		case DELETE_USER_CRITTER: {
			const updatedCritters =  state.user.critters.filter(critterId => critterId !== parseInt(action.critterId))
			return {...state, user: {...state.user, critters: updatedCritters}}
		}
		default:
			return state;
	}
}
