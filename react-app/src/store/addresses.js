import { fetchData } from "./utils";
import { SET_USER, REMOVE_USER } from "./constants";

// const GET_USER_ADDRESSES = "session/GET_USER_ADDRESSES"
const ADD_USER_ADDRESS = "session/ADD_USER_ADDRESS"
const EDIT_USER_ADDRESS = "session/EDIT_USER_ADDRESS"
const DELETE_USER_ADDRESS = "session/DELETE_USER_ADDRESS"

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

export const thunkAddUserAddress = address => async dispatch => {
	const data = await fetchData(`/api/addresses/new`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(address),
	})

	if (data.status === 201) {
		dispatch(addUserAddress(data.address))
	}

	return data
}

export const thunkEditUserAddress = address => async dispatch => {
	const data = await fetchData(`/api/addresses/${address.id}/edit`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(address),
	})

	if (data.status === 200) dispatch(editUserAddress(data.address))

	return data
}

export const thunkDeleteUserAddress = addressId => async dispatch => {
	const data = await fetchData(`/api/addresses/${addressId}/delete`, {
		method: "DELETE",
	})

	if (data.status === 200) dispatch(deleteUserAddress(parseInt(addressId)))

	return data
}

const initialState = {}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER: {
			return action.payload.addresses
		}
		case REMOVE_USER: {
			return initialState
		}
		case ADD_USER_ADDRESS: {
			return {
				...state,
				[action.address.id]: action.address,
			}
		}
		case EDIT_USER_ADDRESS: {
			return {
				...state,
				[action.address.id]: action.address,
			}
		}
		case DELETE_USER_ADDRESS: {
			const newState = {...state};
			delete newState[action.addressId];
			return newState
		}
		default:
			return state;
	}
}
