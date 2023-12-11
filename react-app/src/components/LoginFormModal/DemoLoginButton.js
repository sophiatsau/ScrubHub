import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { login } from "../../store/session";

export default function DemoLoginButton({setErrors,closeModal}) {
    const dispatch = useDispatch()
    const history = useHistory()

    const demoLogin = async (e) => {
        e.preventDefault()
        const data = await dispatch(login("demo@aa.io", "password"));
        if (data.errors) {
            setErrors("Failed to log in as Demo User.");
        } else {
            closeModal()
            history.push('/')
        }
    }
    return (
    <button className='demo-login-button light-button' onClick={demoLogin}>
        Log in as Demo User
    </button>
  )
}
