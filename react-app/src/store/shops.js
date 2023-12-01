import { fetchData } from "./utils";

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
    const response = await fetchData("/api/shops");
    if (!response.errors) {
        dispatch(getAllShops(response.shops));
    }
    return response;
}

const initialState = {
    all: {}
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_SHOPS: {
            const newState = {}
            action.shops.forEach(shop => {
                newState[shop.id] = shop
            })
            return {...newState}
        }
        case GET_ONE_SHOP:
            return {...state, [action.shop.id]: action.shop}
        default:
            return state
    }
}
