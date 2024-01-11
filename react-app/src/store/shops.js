import { normalizeObj, fetchData } from "./utils"
const GET_ALL_SHOPS = "shops/GET_ALL_SHOPS"
const GET_USER_SHOPS = "shops/GET_USER_SHOPS"
const GET_ONE_SHOP = "shops/GET_ONE_SHOP"
const CREATE_SHOP = "shops/CREATE_SHOP"
const EDIT_SHOP = "shops/EDIT_SHOP"
const DELETE_SHOP = "shops/DELETE_SHOP"
const DELETE_SHOP_CRITTER = "session/DELETE_SHOP_CRITTER"
const ADD_SHOP_CRITTER = "session/ADD_SHOP_CRITTER"

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

const deleteShop = (shopId) => ({
    type: DELETE_SHOP,
    shopId
})

export const addShopCritter = (shopId, critterId) => ({
    type: ADD_SHOP_CRITTER,
    shopId,
    critterId,
})

export const deleteShopCritter = (shopId, critterId) => ({
    type: DELETE_SHOP_CRITTER,
    shopId,
    critterId,
})

export const thunkGetAllShops = () => async (dispatch) => {
    const response = await fetch("/api/shops/");

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
    const data = await fetchData(`/api/shops/${shopId}`);
    // const data = await response.json();
    if (data.status!==200) return data;
    else {
        // get shop + critter data in 1 fetch
        // but don't put critters in shop store
        let critters = data.shop.crittersDetails;
        delete data.shop.crittersDetails;
        dispatch(getOneShop(data.shop));
        return {...data, critters};
    }
}

export const thunkCreateShop = formData => async dispatch => {
    const data = await fetchData(`/api/shops/new`, {
        method: "POST",
        body: formData,
    })

    if (data.status===201) {
        dispatch(createShop(data.shop))
    }

    return data;
}

export const thunkEditShop = (shopId, formData) => async dispatch => {
    const data = await fetchData(`/api/shops/${shopId}/edit`, {
        method: "PUT",
        body: formData,
    })

    if (data.status===200) {
        dispatch(editShop(data.shop))
    }

    return data;
}

export const thunkDeleteShop = (shopId) => async dispatch => {
    const data = await fetchData(`/api/shops/${shopId}/delete`, {
        method: "DELETE",
    })

    if (data.status === 200) {
        dispatch(deleteShop(shopId))
    }

    return data;
}

const initialState = {allShops:{}, currentShop: {}}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_SHOPS: {
            return {...state, allShops: normalizeObj(action.shops)}
        }
        case GET_USER_SHOPS: {
            return {...state, allShops: normalizeObj(action.shops)}
        }
        case GET_ONE_SHOP:
            return {...state, [action.shop.id]: action.shop}
        case CREATE_SHOP: {
            return {...state, [action.shop.id]: action.shop}
        }
        case EDIT_SHOP: {
            return {...state, [action.shop.id]: action.shop}
        }
        case DELETE_SHOP: {
            const newState = {...state}
            delete newState[action.shopId]
            return newState
        }
        case ADD_SHOP_CRITTER: {
            const shop = {...state[action.shopId]}
            shop.critters = [...shop.critters, parseInt(action.critterId)]
            return {...state, [shop.id]: shop}
        }
        case DELETE_SHOP_CRITTER: {
            const shop = {...state[action.shopId]}
            shop.critters = shop.critters.filter(critter => critter.id !== parseInt(action.critterId))
            return {...state, [shop.id]: shop}
        }
        default:
            return state
    }
}
