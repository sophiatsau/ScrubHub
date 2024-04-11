import React, {useState, useContext} from 'react'
import { fetchData } from '../store/utils'

const AddressValidatorContext = React.createContext()

export function AddressValidatorProvider({children}) {
    //address is validated and is valid / invalid
    const [validAddress, setValidAddress] = useState(false)
    //the validated address
    const [confirmAddress, setConfirmAddress] = useState("")
    //user has confirmed Google API returned address to be desired address
    const [confirmed, setConfirmed] = useState(false)
    //error message returned by validateAddress function if 1) address is invalid or 2) some sort of backend error
    const [invalidError, setInvalidError] = useState("")
    //is server in process of validating address? if true, some buttons should be temporarily disabled
    const [validating, setValidating] = useState(false)

    const resetValidatorValues = () => {
        setValidAddress(false)
        setConfirmAddress("")
        setConfirmed(false)
        setInvalidError("")
        setValidating(false)
    }

    const contextValue = {
        validAddress, setValidAddress,
        confirmAddress, setConfirmAddress,
        confirmed, setConfirmed,
        invalidError, setInvalidError,
        validating, setValidating,
        resetValidatorValues,
    }

    return (
        <>
            <AddressValidatorContext.Provider value={contextValue}>
                {children}
            </AddressValidatorContext.Provider>
        </>
    )
}

export function AddressValidatorButton() {
    return (
        <button>Address Validation Button</button>
    )
}

export const useAddressValidator = () => useContext(AddressValidatorContext)
