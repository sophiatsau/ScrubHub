import React, {useState, useContext} from 'react'
import { fetchData } from '../store/utils'

const AddressValidatorContext = React.createContext()

export function AddressValidatorProvider({children}) {
    const [validAddress, setValidAddress] = useState(false)
    const [confirmAddress, setConfirmAddress] = useState("")
    const [confirmed, setConfirmed] = useState(false)
    const [errors, setErrors] = useState({disabled: true})
    const [invalidError, setInvalidError] = useState("")
    const [validating, setValidating] = useState(false)

    const contextValue = {
        //
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
