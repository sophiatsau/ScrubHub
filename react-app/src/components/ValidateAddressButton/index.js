import React, { useEffect } from 'react'
import { useAddressValidator } from '../../context/ValidateAddress'
import { componentsToAddressLines, fetchData, fullAddressToComponents } from '../../store/utils'

export default function ValidateAddressButton({formData, setFormData, errors}) {
    const {validAddress, setValidAddress,
        confirmAddress, setConfirmAddress,
        confirmed, setConfirmed,
        invalidError, setInvalidError,
        validating, setValidating,
    } = useAddressValidator()

    const handleConfirmAddress = e => {
        setConfirmed(e.target.checked)
        if (e.target.checked) {
          setFormData({name: formData.name,
            ...fullAddressToComponents(confirmAddress)})
        }
    }

    const validateAddress = async (e) => {
        e.preventDefault()
        setValidating(true)

        const data = await fetchData(
        `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.REACT_APP_MAPS_KEY}`,
        {
            method:"POST",
            body: JSON.stringify({
            "address": {
                "addressLines": componentsToAddressLines(formData)}
                // "addressLines": ["1 World Way"]}
            })
        })
        console.log("🚀 ~ validateAddress ~ componentsToAddressLines(components):", componentsToAddressLines(formData))
        console.log("🚀 ~ validateAddress ~ formData:", formData)

        if (data.status===200) {
        const {verdict, address} = data.result
        if (verdict.hasUnconfirmedComponents) {
            setInvalidError("No matching address was found. Please check for typos and try again.")
            setValidAddress(false)
        }
        else {
            setInvalidError("")
            setValidAddress(true)
            setConfirmAddress(address.formattedAddress)
            // setFormData(fullAddressToComponents(address.formattedAddress))
        }
        } else {
            setInvalidError("Something funny happened. Please refresh the page and try again.")
        }
    }

    const validationDiv = invalidError ?
        <div className='error'>{invalidError}</div>
        :
        <div className={validAddress ? 'address-checkbox-container' : 'hidden'}>
            Please confirm your address:
            <label className='address-checkbox' style={{marginTop:"8px"}}>
            <input
                type="checkbox"
                name="fullAddress"
                checked={confirmed}
                value={confirmed}
                onChange={handleConfirmAddress}
                required
            />
            <div>{confirmAddress}</div>
            </label>
        </div>

    return (
        <>
        <button
            type="submit"
            onClick={validateAddress}
            className={`purple-button ${Object.values(errors).length || validating ? "disabled" : ""}`}
        >
            Validate Address
        </button>
        <div style={{minHeight:"40px"}}>
            {validationDiv}
        </div>
        </>
    )
}
