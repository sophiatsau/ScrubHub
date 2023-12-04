// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const USER_ADD_SHOP = "session/USER_ADD_SHOP"
const DELETE_USER_SHOP = "session/DELETE_USER_SHOP"


const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

export const userAddShop = (shopId) => ({
	type: USER_ADD_SHOP,
	shopId
})

export const deleteUserShop = (shopId) => ({
	type: DELETE_USER_SHOP,
	shopId
})

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return {"UnknownError": "An error occurred. Please try again."};
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (formData) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return {"UnknownError": "An error occurred. Please try again."};
	}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		case USER_ADD_SHOP:
			return { user: {...state.user, shops:[...state.user.shops, parseInt(action.shopId)]} }
		case DELETE_USER_SHOP: {
			const newShops =  state.user.shops.filter(shopId => shopId !== parseInt(action.shopId))
			console.log("🚀 ~ file: session.js:116 ~ reducer ~ newShops:", newShops)
			return {user: {...state.user, shops: newShops}}
		}
		default:
			return state;
	}
}
