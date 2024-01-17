import { fetchData } from "./utils";

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

const initialState = {}

export default function reducer(state = initialState, action) {
	switch (action.type) {
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
		default:
			return state;
	}
}
