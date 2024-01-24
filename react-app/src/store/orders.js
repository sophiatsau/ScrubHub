import { fetchData, normalizeObj } from "./utils";
import {
	SET_USER,
	REMOVE_USER,
	START_ORDER,
	ADD_TO_BAG,
	EMPTY_BAG,
	REMOVE_FROM_BAG,
	UPDATE_BAG
} from "./constants";

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

export const emptyBag = (orderId) => ({
	type: EMPTY_BAG,
	orderId,
})

export const removeFromBag = (detailId) => ({
	type: REMOVE_FROM_BAG,
	detailId
})

export const checkout = (order) => ({
	type: CHECKOUT,
	order
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
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(detail),
	});

	if (data.status===201) {
		dispatch(addToBag(data.detail));
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
	const data = await fetchData(`/api/orders/${orderId}/checkout`, {method: 'PATCH'});

	if (data.status===200) {
		dispatch(checkout(data.order));
	}

	return data
}

export const thunkCompleteOrder = (orderId) => async (dispatch) => {
	const data = await fetchData(`/api/orders/${orderId}/complete`, {method: 'PATCH'});

	if (data.status===200) {
		dispatch(completeOrder(orderId));
	}

	return data
}

/******** GETTER */
export const consumeBag = () => (state) => state.orders.bag ? state.orders[state.orders.bag] : null;

const initialState = {
	bag: null, //bag is an id
}

export default function reducer(state=initialState, action) {
    switch (action.type) {
		case SET_USER: {
			const {orders, bag} = action.payload
			return {...normalizeObj(orders), bag: bag ? bag.id:null}
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
			const order = state[action.detail.orderId]
			const orderDetails = [...order.orderDetails, action.detail.id]
			return {
				...state,
				[order.id]: {...order, orderDetails}
			}
		}
		case EMPTY_BAG: {
			const newState = {...state}
			delete newState[newState.bag]
			newState.bag = null
			return newState
		}
		case REMOVE_FROM_BAG: {
			const detailId = parseInt(action.detailId)
			const order = state[state.bag]
			const orderDetails = order.orderDetails.filter(detail => detail.id !== detailId)
			return {
				...state,
				[order.id]: {...order, orderDetails}
			}
		}
		case CHECKOUT: {
			return {
				...state,
				bag: null,
				[action.order.id]: action.order,
			}
		}
		case COMPLETE_ORDER: {
			return {
				...state,
				[action.order.id]: action.order,
			}
		}
		case UPDATE_BAG: {
			return {
				...state,
				[action.detail.orderId]: {...action.detail.order}
			}
		}
        default:
            return state;
    }
}
