import { fetchData } from "./utils";

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
};

export default function reducer(state, action) {
    switch (action.type) {
        default:
            return state;
    }
}
