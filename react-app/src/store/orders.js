import { fetchData } from "./utils";
import { SET_USER, REMOVE_USER } from "./constants";

const START_ORDER = "session/START_ORDER"
const ADD_TO_BAG = "session/ADD_TO_BAG"
const UPDATE_BAG = "session/UPDATE_BAG"
const EMPTY_BAG = "session/EMPTY_BAG"
const REMOVE_FROM_BAG = "session/REMOVE_FROM_BAG"
const CHECKOUT = "session/CHECKOUT"
const COMPLETE_ORDER = "session/COMPLETE_ORDER"

/************* ACTIONS **************** */
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
export const thunkStartOrder = (order) => async (dispatch) => {
	const data = await fetchData("/api/orders/new", {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(order),
	});

	if (data.status===201) {
		dispatch(startOrder(data.order));
	}

	return data
};

export const thunkAddToBag = (detail, orderId) => async (dispatch) => {
	const data = await fetchData(`/api/orders/${orderId}/add`, {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(detail),
	});

	if (data.status===200) {
		dispatch(addToBag(data.order));
	}

	return data
}

export const thunkUpdateBag = (detail) => async (dispatch) => {
	const data = await fetchData(`/api/orders/details/${detail.id}/update`, {
		method: 'PATCH',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(detail),
	});

	if (data.status===200) {
		dispatch(updateBag(data.order));
	}

	return data
}

export const thunkEmptyBag = (orderId) => async (dispatch) => {
	const data = await fetchData(`/api/orders/${orderId}/delete`, {
		method: 'DELETE',
	});

	if (data.status===200) {
		dispatch(emptyBag(orderId));
	}

	return data
}

export const thunkRemoveFromBag = (detailId) => async (dispatch) => {
	const data = await fetchData(`/api/orders/details/${detailId}/delete`, {
		method: 'DELETE',
	});

	if (data.status===200) {
		dispatch(removeFromBag(detailId));
	}

	return data
}

export const thunkCheckout = (orderId) => async (dispatch) => {
	const data = await fetchData(`/api/orders/${orderId}/checkout`);

	if (data.status===200) {
		dispatch(checkout(data.order));
	}

	return data
}

export const thunkCompleteOrder = (orderId) => async (dispatch) => {
	const data = await fetchData(`/api/orders/${orderId}/complete`);

	if (data.status===200) {
		dispatch(completeOrder(orderId));
	}

	return data
}

const initialState = {}

export default function reducer(state=initialState, action) {
    switch (action.type) {
		case SET_USER: {
			return {...action.payload.orders, bag: action.payload.bag}
		}
		case REMOVE_USER: {
			return initialState
		}
		case START_ORDER: {
			return {
				...state,
				bag: action.order.id,
				[action.order.id]: action.order
			}
		}
		case ADD_TO_BAG: {
			return {
				...state,
				user: {
					...state.user,
					orders: {
						...state.orders,
						[action.order.id]: action.order
					}
				}
			}
		}
        default:
            return state;
    }
}
