import { normalizeObj } from "./utils"
const GET_ALL_SHOPS = "shops/GET_ALL_SHOPS"
const GET_USER_SHOPS = "shops/GET_USER_SHOPS"
const GET_ONE_SHOP = "shops/GET_ONE_SHOP"
const CREATE_SHOP = "shops/CREATE_SHOP"
const EDIT_SHOP = "shops/EDIT_SHOP"

const getAllShops = (shops) => ({
    type: GET_ALL_SHOPS,
    shops
})

const getUserShops = (shops) => ({
    type: GET_USER_SHOPS,
    shops
})

const getOneShop = (shop) => ({
    type: GET_ONE_SHOP,
    shop
})

const createShop = (shop) => ({
    type: CREATE_SHOP,
    shop
})

const editShop = (shop) => ({
    type: EDIT_SHOP,
    shop
})

export const thunkGetAllShops = () => async (dispatch) => {
    const response = await fetch("/api/shops");

    const data = await response.json()
    if (response.ok) {
        dispatch(getAllShops(data.shops));
    } else {
        data.status = response.status;
    }

    return data;
}

export const thunkGetUserShops = () => async (dispatch) => {
    const response = await fetch(`/api/shops/current`);

    const data = await response.json()
    if (response.ok) {
        dispatch(getUserShops(data.shops));
    } else {
        data.status = response.status;
    }

    return data;
}

export const thunkGetShop = (shopId) => async dispatch => {
    const response = await fetch(`/api/shops/${shopId}`);
    const data = await response.json()

    if (response.ok) {
        dispatch(getOneShop(data));
    } else {
        data.status = response.status;
    }

    return data;
}

export const thunkCreateShop = formData => async dispatch => {
    const res = await fetch(`/api/shops/new`, {
        method: "POST",
        body: formData,
    })
    const data = await res.json()

    if (res.ok) {
        dispatch(createShop(data))
    } else {
        data.status = res.status
    }

    return data;
}

export const thunkEditShop = (shopId, formData) => async dispatch => {
    const res = await fetch(`/api/shops/${shopId}/edit`, {
        method: "PUT",
        body: formData,
    })

    const data = await res.json()

    if (res.ok) {
        dispatch(editShop(data))
    } else {
        data.status = res.status
    }

    return data;
}


const initialState = {}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_SHOPS: {
            return normalizeObj(action.shops)
        }
        case GET_USER_SHOPS: {
            return {...state, ...normalizeObj(action.shops)}
        }
        case GET_ONE_SHOP:
            return {...state, [action.shop.id]: action.shop}
        case CREATE_SHOP: {
            return {...state, [action.shop.id]: action.shop}
        }
        case EDIT_SHOP: {
            return {...state, [action.shop.id]: action.shop}
        }
        default:
            return state
    }
}
