import { fetchData } from "./utils";

import { SET_USER, REMOVE_USER, CHECKOUT } from "./constants";

const USER_ADD_SHOP = "session/USER_ADD_SHOP"
const DELETE_USER_SHOP = "session/DELETE_USER_SHOP"

const SAVE_LOCATION = "session/SAVE_LOCATION"

const DELETE_USER_CRITTER = "session/DELETE_USER_CRITTER"
const ADD_USER_CRITTER = "session/ADD_USER_CRITTER"

const START_ORDER = "session/START_ORDER"
const ADD_TO_BAG = "session/ADD_TO_BAG"
const UPDATE_BAG = "session/UPDATE_BAG"
const EMPTY_BAG = "session/EMPTY_BAG"
const REMOVE_FROM_BAG = "session/REMOVE_FROM_BAG"
const COMPLETE_ORDER = "session/COMPLETE_ORDER"

const UPDATE_BALANCE = "session/UPDATE_BALANCE"

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

export const addToBag = (order) => ({
	type: ADD_TO_BAG,
	order
})

export const updateBag = (order) => ({
	type: UPDATE_BAG,
	order
})

export const emptyBag = (orderId) => ({
	type: EMPTY_BAG,
	orderId
})

export const removeFromBag = (detailId) => ({
	type: REMOVE_FROM_BAG,
	detailId
})

export const checkout = (payload) => ({
	type: CHECKOUT,
	payload
})

export const completeOrder = (orderId) => ({
	type: COMPLETE_ORDER,
	orderId
})

const updateBalance = payload => ({
	type: UPDATE_BALANCE,
	payload
})

/********************** THUNKS ************** */
export const authenticate = () => async (dispatch) => {
	const data = await fetchData("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (data.status === 200) {
		// if (data.errors) {
		// 	return;
		// }

		dispatch(setUser(data));
	}

	return data
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

	if (data.status === 200) {
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

	return data
};

export const signUp = (formData) => async (dispatch) => {
	const data = await fetchData("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

	if (data.status===201) {
		dispatch(setUser(data));
	}

	return data;
};

export const thunkUpdateBalance = balance => async dispatch => {
	const data = await fetchData("/api/users/add-balance", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({balance}),
	});

	if (data.status === 200) {
		dispatch(updateBalance(data));
	}
	return data;
}

// use store for location: notify when to update interface to match
const initLocation = JSON.parse(localStorage.getItem("location"))
const initialState = { user: null, location: initLocation };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		// set, remove user will keep the location which isn't saved in database.
		case SET_USER:{
			const user = {...action.payload}
			delete user.bag
			// delete user.orders
			delete user.addresses
			user.orders = user.orders.map(order => order.id)
			return { user, location: state.location };
		}
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
		case ADD_USER_CRITTER: {
			return { ...state, user: {...state.user, critters:[...state.user.critters, parseInt(action.critterId)]} }
		}
		case DELETE_USER_CRITTER: {
			const updatedCritters =  state.user.critters.filter(critterId => critterId !== parseInt(action.critterId))
			return {...state, user: {...state.user, critters: updatedCritters}}
		}
		case CHECKOUT: {
			return {
				...state,
				user: {
					...state.user,
					balance: action.payload.user.balance
				}
			}
		}
		case UPDATE_BALANCE: {
			if (action.payload.user.id !== state.user.id) return state

			return {
				...state,
				user: {
					...state.user,
					balance: action.payload.user.balance
				}
			}
		}
		default:
			return state;
	}
}
