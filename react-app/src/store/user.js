// import { fetchData } from "./utils";
// import { combineReducers } from "redux";
// import addresses from './addresses';
// import orders from './orders';
// import { SET_USER, CHECKOUT } from "./constants"

// const REMOVE_USER = "session/REMOVE_USER";

// const USER_ADD_SHOP = "session/USER_ADD_SHOP"
// const DELETE_USER_SHOP = "session/DELETE_USER_SHOP"

// const DELETE_USER_CRITTER = "session/DELETE_USER_CRITTER"
// const ADD_USER_CRITTER = "session/ADD_USER_CRITTER"

// const UPDATE_BALANCE = "session/UPDATE_BALANCE"

// const setUser = (user) => ({
// 	type: SET_USER,
// 	payload: user,
// });

// const removeUser = () => ({
// 	type: REMOVE_USER,
// });

// export const userAddShop = (shopId) => ({
// 	type: USER_ADD_SHOP,
// 	shopId,
// })

// export const deleteUserShop = (shopId) => ({
// 	type: DELETE_USER_SHOP,
// 	shopId,
// })

// export const deleteUserCritter = critterId => ({
// 	type: DELETE_USER_CRITTER,
// 	critterId
// })

// export const addUserCritter = critterId => ({
// 	type: ADD_USER_CRITTER,
// 	critterId
// })

// const updateBalance = payload => ({
// 	type: UPDATE_BALANCE,
// 	payload
// })


// export const authenticate = () => async (dispatch) => {
// 	const data = await fetchData("/api/auth/", {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	});
// 	if (data.status === 200) {
// 		// const data = await response.json();
// 		if (data.errors) {
// 			return;
// 		}

// 		dispatch(setUser(data));
// 	}
// };

// export const login = (email, password) => async (dispatch) => {
// 	const data = await fetchData("/api/auth/login", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			email,
// 			password,
// 		}),
// 	});

// 	if (!data.errors) {
// 		dispatch(setUser(data)); }
// 	return data
// };

// export const logout = () => async (dispatch) => {
// 	const data = await fetchData("/api/auth/logout", {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	});

// 	if (data.status===200) {
// 		dispatch(removeUser());
// 	}
// };

// export const signUp = (formData) => async (dispatch) => {
// 	const data = await fetchData("/api/auth/signup", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(formData),
// 	});

// 	if (!data.errors) {
// 		dispatch(setUser(data));
// 	}
// 	return data;
// };

// export const thunkUpdateBalance = balance => async dispatch => {
// 	const data = await fetchData("/api/users/add-balance", {
// 		method: "PATCH",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({balance}),
// 	});

// 	if (data.status === 200) {
// 		console.log("🚀 ~ thunkUpdateBalance ~ data:", data)
// 		dispatch(updateBalance(data));
// 		console.log("IN THUNK, AFTER DISPATCHING ACTION")
// 	}
// 	return data;
// }

// const initialState = null;

// function user(state = initialState, action) {
// 	switch (action.type) {
// 		case SET_USER:
// 			return action.payload;
// 		case REMOVE_USER:
// 			return null;
// 		case USER_ADD_SHOP:
// 			return { ...state,
// 				shops:[...state.shops, parseInt(action.shopId)] }
// 		case DELETE_USER_SHOP: {
// 			const newShops =  state.shops.filter(shopId => shopId !== parseInt(action.shopId))
// 			return {...state, shops: newShops}
// 		}
// 		case ADD_USER_CRITTER: {
// 			return { ...state, critters:[...state.critters, parseInt(action.critterId)] }
// 		}
// 		case DELETE_USER_CRITTER: {
// 			const updatedCritters =  state.critters.filter(critterId => critterId !== parseInt(action.critterId))
// 			return {...state, critters: updatedCritters}
// 		}
// 		case CHECKOUT: {
// 			return {...state, balance: action.user.balance}
// 		}
// 		case UPDATE_BALANCE: {
// 			console.log('UPDATING BALANCE???')
// 			console.log("🚀 ~ user ~ action.payload.user.id:", action.payload.user.id)
// 			console.log("🚀 ~ user ~ state.id:", state.id)
// 			console.log("🚀 ~ user ~ action.payload.user.id:", action.payload.user.id)
// 			if (action.payload.user.id !== state.id) return state
// 			return {...state, balance: action.payload.user.balance}
// 		}
// 		default:
// 			return state;
// 	}
// }
