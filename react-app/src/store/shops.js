import { normalizeObj } from "./utils"
const GET_ALL_SHOPS = "shops/GET_ALL_SHOPS"
const GET_ONE_SHOP = "shops/GET_ONE_SHOP"

const getAllShops = (shops) => ({
    type: GET_ALL_SHOPS,
    shops
})

const getOneShop = (shop) => ({
    type: GET_ONE_SHOP,
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

const initialState = {}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_SHOPS: {
            return {...normalizeObj(action.shops)}
        }
        case GET_ONE_SHOP:
            return {...state, [action.shop.id]: action.shop}
        default:
            return state
    }
}
