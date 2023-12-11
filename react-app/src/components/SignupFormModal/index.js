import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import DemoLoginButton from "../LoginFormModal/DemoLoginButton";

function SignupFormModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	// const [email, setEmail] = useState("");
	// const [username, setUsername] = useState("");
	// const [firstName, setFirstName] = useState("");
	// const [lastName, setLastName] = useState("");
	// const [password, setPassword] = useState("");
	// const [confirmPassword, setConfirmPassword] = useState("");
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

	// useEffect(() => {
	// 	const {username, email, firstName, lastName, password, confirmPassword} = formData;

	// 	if (!submitted) return;
	// 	console.log(errors)

	// 	const newErrors = {};
	// 	if (username.length < 4 || username.length > 40) newErrors.username = errors.username || "Username must be between 4 - 40 characters long"
	// 	if (!email.match(/.@./)) errors.email = newErrors.email || "Email is invalid"
	// 	if (firstName.length < 1 || firstName.length > 40) newErrors.firstName = "First name must be between 1 - 40 characters long"
	// 	if (lastName.length < 1 || lastName.length > 40) newErrors.lastName = "Last name must be between 1 - 40 characters long"
	// 	if (password.length < 6 || password.length > 40) newErrors.password = "Password must be between 6 - 255 characters long"
	// 	if (password !== confirmPassword) newErrors.password = "Confirm Password field must be the same as the Password field"

	// 	if (Object.values(newErrors).length !== Object.values(errors).length) setErrors(newErrors)
	// }, [setErrors, formData, submitted, errors])

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
				password: "Confirm Password field must be the same as the Password field",
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
						required
					/>
				</label>
				{errors.email && <div className="error">{errors.email}</div>}
				<label>
					Username
					<input
						type="text"
						value={formData.username}
						name="username"
						onChange={handleFormUpdate}
						required
					/>
				</label>
				{errors.username && <div className="error">{errors.username}</div>}
				<label>
					First Name
					<input
						type="text"
						value={formData.firstName}
						onChange={handleFormUpdate}
						name="firstName"
						required
					/>
				</label>
				{errors.firstName && <div className="error">{errors.firstName}</div>}
				<label>
					Last Name
					<input
						type="text"
						value={formData.lastName}
						name="lastName"
						onChange={handleFormUpdate}
						required
					/>
				</label>
				{errors.lastName && <div className="error">{errors.lastName}</div>}
				<div>
					<label>
						Password (6+ characters)
						<input
							type="password"
							value={formData.password}
							name="password"
							onChange={handleFormUpdate}
							required
						/>
					</label>
					<label>
						Confirm Password
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleFormUpdate}
							required
						/>
					</label>
				</div>
				{errors.password && <div className="error">{errors.password}</div>}
				<button type="submit" className={`purple-button`}
				style={{marginTop:"5px"}}
				>Sign Up</button>
				<DemoLoginButton {...{setErrors, closeModal}}/>
			</form>
		</>
	);
}

export default SignupFormModal;
