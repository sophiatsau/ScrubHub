import { normalizeObj, fetchData } from "./utils"

const GET_ALL_CRITTERS = "critters/GET_ALL_CRITTERS"
const GET_USER_CRITTERS = "critters/GET_USER_CRITTERS"
// const GET_ONE_CRITTER = "critters/GET_ONE_CRITTER"
const GET_SHOP_CRITTERS = "critters/GET_SHOP_CRITTERS"
const CREATE_CRITTER = "critters/CREATE_CRITTER"
const EDIT_CRITTER = "critters/EDIT_CRITTER"
const DELETE_CRITTER = "critters/DELETE_CRITTER"

const getAllCritters = (critters) => ({
    type: GET_ALL_CRITTERS,
    critters
})

const getUserCritters = (critters) => ({
    type: GET_USER_CRITTERS,
    critters
})

export const getShopCritters = critters => ({
    type: GET_SHOP_CRITTERS,
    critters
})

// const getOneCritter = (critter) => ({
//     type: GET_ONE_CRITTER,
//     critter
// })

const createCritter = (critter) => ({
    type: CREATE_CRITTER,
    critter
})

const editCritter = (critter) => ({
    type: EDIT_CRITTER,
    critter
})

const deleteCritter = (critterId) => ({
    type: DELETE_CRITTER,
    critterId
})

export const thunkGetAllCritters = () => async (dispatch) => {
    const data = await fetchData("/api/critters/");

    if (!data.errors) {
        dispatch(getAllCritters(data.critters));
    }

    return data;
}

export const thunkGetUserCritters = () => async (dispatch) => {
    const data = await fetchData(`/api/critters/current`);

    if (!data.errors) {
        dispatch(getUserCritters(data.critters));
    }

    return data;
}

export const thunkCreateCritter = (formData, shopId) => async dispatch => {
    const data = await fetchData(`/api/shops/${shopId}/critters/new`, {
        method: "POST",
        body: formData,
    })

    if (!data.status) {
        dispatch(createCritter(data));
    }

    return data;
}


export const thunkEditCritter = (critterId, formData) => async dispatch => {
    const res = await fetch(`/api/critters/${critterId}/edit`, {
        method: "PUT",
        body: formData,
    })

    const data = await res.json()

    if (res.ok) {
        dispatch(editCritter(data))
    } else {
        data.status = res.status
    }

    return data;
}

export const thunkDeleteCritter = (critterId) => async dispatch => {
    const res = await fetch(`/api/critters/${critterId}/delete`, {
        method: "DELETE",
    })

    const data = await res.json()

    if (res.ok) {
        dispatch(deleteCritter(critterId))
        //update shop, user
    } else {
        data.status = res.status
    }

    return data;
}


const initialState = {}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_CRITTERS: {
            return normalizeObj(action.critters)
        }
        case GET_USER_CRITTERS: {
            return {...state, ...normalizeObj(action.critters)}
        }
        // case GET_ONE_CRITTER:
        //     return {...state, [action.critter.id]: action.critter}
        case GET_SHOP_CRITTERS: {
            return {...state, ...normalizeObj(action.critters)}
        }
        case CREATE_CRITTER: {
            return {...state, [action.critter.id]: action.critter}
        }
        case EDIT_CRITTER: {
            return {...state, [action.critter.id]: action.critter}
        }
        case DELETE_CRITTER: {
            const newState = {...state}
            delete newState[action.critterId]
            return newState
        }
        default:
            return state
    }
}
