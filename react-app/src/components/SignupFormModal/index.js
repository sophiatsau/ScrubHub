import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import DemoLoginButton from "../LoginFormModal/DemoLoginButton";
import OauthButton from "../OauthButton";

function SignupFormModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleErrorsUpdate = e => {
		const {name, value} = e.target;
		let newError = null;
		switch (name) {
            case "username": {
                newError = (value.length < 4 || value.length > 40) ? "Username must be between 4 - 40 characters long" : ""
                break;
            }
            case "email": {
                newError = (!value.match(/.@./)) ? "Email is invalid" : "";
                break;
            }
			case "firstName": {
                newError = (value.length < 1 || value.length > 40) ? "First name must be between 1 - 40 characters long" : "";
                break;
            }
			case "lastName": {
                newError = (value.length < 1 || value.length > 40) ? "Last name must be between 1 - 40 characters long" : "";
                break;
            }
			case "password": {
				newError = (value.length < 6 || value.length > 255) ? "Password must be between 6 - 255 characters long" : "";
                break;
			}
			case "confirmPassword": {
				newError = formData.password !== value ? "Confirm Password field must match the Password field" : ""
                break;
			}
            default: return
        }
		setErrors(prevErrors => {
            if (newError) return {...prevErrors, [name]: newError};
            else {
                let errors = {...prevErrors};
                delete errors[name];
                return errors;
            }
        })
	}

	const handleFormUpdate = (e) => {
		const {name, value} = e.target;
		setFormData({...formData, [name]: value})
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password === formData.confirmPassword) {
			const {confirmPassword, ...sentData} = formData;
			const data = await dispatch(signUp(sentData));
			if (data.errors) {
				setErrors(data.errors);
				setFormData({...formData, password:"", confirmPassword:""})
			} else {
				closeModal();
				history.push('/')
			}
		} else {
			setErrors({
				confirmPassword: "Confirm Password field must match the Password field",
			});
			setFormData({...formData, password:"", confirmPassword:""})
		}
	};

	return (
		<>
			<h1 style={{marginBottom: "5px"}}>Sign Up</h1>
			<form onSubmit={handleSubmit} id="signup-form">
				{errors.UnknownError && <div className="error">{errors.UnknownError}</div>}
				<label>
					Email
					<input
						type="email"
						value={formData.email}
						name="email"
						onChange={handleFormUpdate}
						onBlur={handleErrorsUpdate}
						required
					/>
				</label>
				<div className="error">{errors.email}</div>
				<label>
					Username
					<input
						type="text"
						value={formData.username}
						name="username"
						onChange={handleFormUpdate}
						onBlur={handleErrorsUpdate}
						required
					/>
				</label>
				<div className="error">{errors.username}</div>
				<label>
					First Name
					<input
						type="text"
						value={formData.firstName}
						onChange={handleFormUpdate}
						name="firstName"
						onBlur={handleErrorsUpdate}
						required
					/>
				</label>
				<div className="error">{errors.firstName}</div>
				<label>
					Last Name
					<input
						type="text"
						value={formData.lastName}
						name="lastName"
						onChange={handleFormUpdate}
						onBlur={handleErrorsUpdate}
						required
					/>
				</label>
				<div className="error">{errors.lastName}</div>
				<div>
					<label>
						Password
						<input
							type="password"
							value={formData.password}
							name="password"
							onChange={handleFormUpdate}
							onBlur={handleErrorsUpdate}
							required
							minLength={6}
						/>
					</label>
					<label>
						Confirm Password
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleFormUpdate}
							onBlur={handleErrorsUpdate}
							required
						/>
					</label>
				</div>
				<div className="error">{errors.password || errors.confirmPassword}</div>
				<button type="submit" className={`purple-button ${Object.values(errors).length?"disabled":""}`}
				style={{marginTop:"10px"}}
				>Sign Up</button>
				<OauthButton />
				<DemoLoginButton {...{setErrors, closeModal}}/>
			</form>
		</>
	);
}

export default SignupFormModal;
